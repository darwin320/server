import { User } from "@prisma/client";
import { Request, Response } from "express";
import { Err } from "ts-results";
import { logMotion } from "../../audit/audit";
import { UserDatabase } from "../../db/userDatabase";
import { Errors } from "../../models/errors/errors"
import { ApiEndpoint } from "../api/apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class UsersApiEndpoint extends ApiEndpoint {
    public getElementsType(app: any): void {
       // throw new Error("Method not implemented.");
    }
    constructor() {
        super("users");
    }

    public getElements(_app: any): void {}

    public searchElements(app: any): void {
        app.post(
            this.getUrlWithExtension("search"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const search = request.body.userSearch;
                const skip = request.body.skip;
                const take = request.body.take;

                const result = await UserDatabase.searchUser(
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
            this.getUrlWithExtension("get/:userId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const userId = parseInt(request.params["userId"]);

                const result = await UserDatabase.getUserById(userId, true);
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
            async (request: Request, response: Response, next: any) => {
                const result = await UserDatabase.createUser(request.body);
                response.locals.result = result;
                next();
            },
            this.sendObjectResponse
        );
    }

    public updateElement(app: any): void {
        app.put(
            this.getUrlWithExtension("update/:userId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const userId = parseInt(request.params["userId"]);
                const result = await UserDatabase.updateUser(
                    userId,
                    request.body
                );
                response.locals.result = result;

                next();
            },
            this.sendObjectResponse
        );
    }

    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:userId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const userId = parseInt(request.params["userId"]);
                if ((request.user as User).id == userId) {
                    response.locals.result = Err(
                        Errors.getErrorFromCode("CDCUE")
                    );
                }

                response.locals.result = await UserDatabase.deleteUser(userId);

                next();
            },
            this.sendOkResponse
        );
    }

    public registerCustomMethods(app: any): void {
        app.get(
            this.getUrlWithExtension("current-user"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                response.send(request.user);
            }
        );
    }
}
