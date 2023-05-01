import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { ActionDatabase } from "../../db/actionDatabase";
import { ApiEndpoint } from "../api/apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class ActionsApiEndpoint extends ApiEndpoint {
    public getElementsType(app: any): void {
        //throw new Error("Method not implemented.");
    }
    constructor() {
        super("actions");
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

                const result = await ActionDatabase.searchAction(
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
            this.getUrlWithExtension(":actionId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const actionId = parseInt(request.params["actionId"]);
                const changes = request.body;
                const result = await ActionDatabase.updateActionById(
                    actionId,
                    changes
                );

                response.send(result);
            }
        );
    }

    public createElement(app: any): void {
        app.post(
            this.getUrlWithExtension(":actionId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const actionInformation = request.body;
                const result = await ActionDatabase.createAction(
                    actionInformation
                );

                response.send(result);
            }
        );
    }

    public updateElement(app: any): void {
        app.post(
            this.getUrlWithExtension(":actionId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const actionInformation = request.body;
                const result = await ActionDatabase.createAction(
                    actionInformation
                );

                response.send(result);
            }
        );
    }

    public getElements(app: any): void {
        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (_request: Request, response: Response) => {
                const actions = await ActionDatabase.getActions();

                response.send(actions);
            }
        );
    }

    public deleteElement(app: any): void {
        app.delete((_request: Request, response: Response) => {
            response.sendStatus(403);
        });
    }

    public registerCustomMethods(_app: any): void {}
}
