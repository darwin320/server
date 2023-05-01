import { Request, Response } from "express";
import { Ok } from "ts-results";
import { logMotion } from "../../audit/audit";
import { ApiDatabase } from "../../db/apiDatabase";

import { RoleDatabase } from "../../db/roleDatabase";
import { ApiEndpoint } from "../api/apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class RolesApiEndpoint extends ApiEndpoint {
    public getElementsType(app: any): void {
        //throw new Error("Method not implemented.");
    }
    constructor() {
        super("roles");
    }

    public getElements(app: any): void {
        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (_: Request, response: Response) => {
                const result = await RoleDatabase.getRoles();

                response.send(result);
            }
        );
    }

    public searchElements(app: any): void {
        app.post(
            this.getUrlWithExtension("search"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const search = request.body.userSearch;
                const skip = request.body.skip;
                const take = request.body.take;
                const result = await RoleDatabase.searchRole(
                    search,
                    skip,
                    take
                );
                response.send(result);
            }
        );
    }

    public getElementById(app: any): void {
        app.get(
            this.getUrlWithExtension(":roleId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const roleId = parseInt(request.params["roleId"]);
                const result = await RoleDatabase.getRoleById(roleId);

                response.send(result);
            }
            
        );
    }

    public createElement(app: any): void {
        app.post(
            this.getUrlWithExtension("create"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const result = await RoleDatabase.createRole(
                    request.body.roleName
                );
                const apis = await ApiDatabase.getApis();

                // This right here might be problematic in the future, as we are
                // creating the role and generating all the relationships with
                // the APIs, so if we have many roles or many APIs, this can be
                // troublesome. For now this I think is the correct way, as we
                // can have a lot of control over the permissions, but we have
                // to see later.
                for (const api of apis) {
                    await ApiDatabase.createApisOnRoles(api.id, result!.id);
                }

                response.sendStatus(200);
            }
        );
    }

    public updateElement(app: any): void {
        app.put(
            this.getUrlWithExtension("update/:roleId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const roleId = parseInt(request.params["roleId"]);
                const changes = request.body;

                const result = await RoleDatabase.updateRoleById(
                    roleId,
                    changes
                );

                response.send(result);
            }
        );
    }

    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:roleId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const roleId = parseInt(request.params["roleId"]);
                const result = await RoleDatabase.deleteRoleById(roleId);

                response.send(result);
            }
        );
    }

    public registerCustomMethods(app: any): void {
        app.put(
            this.getUrlWithExtension("update-apis-on-roles"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const changes = request.body;

                for (const change of changes) {
                    await ApiDatabase.updateApisOnRoles(change);
                }

                response.locals.result = Ok(true);
                next();
            },
            this.sendOkResponse
        );
    }
}
