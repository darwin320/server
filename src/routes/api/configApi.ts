import { Request, Response } from "express";
import { Ok } from "ts-results";
import { logMotion } from "../../audit/audit";
import { CronJobManager } from "../../cron/cron";
import { ConfigDatabase } from "../../db/configDatabase";
import { ApiEndpoint } from "../api/apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export type InvoiceConfigDto = {
    date: Date;
};

export class ConfigApiEndpoint extends ApiEndpoint {
    public getElementsType(app: any): void {
       // throw new Error("Method not implemented.");
    }
    constructor() {
        super("config");
    }

    public getElements(app: any): void {}

    public searchElements(app: any): void {}

    public getElementById(app: any): void {}

    public createElement(app: any): void {}

    public updateElement(app: any): void {}

    public deleteElement(app: any): void {}

    public registerCustomMethods(app: any): void {
        app.get(
            this.getUrlWithExtension("getInvoiceGenerationDate"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response, next: any) => {
                const date = await ConfigDatabase.getInvoiceGenerationDate();

                if (date.ok) {
                    response.locals.result = Ok(new Date(date.val.value));
                } else {
                    response.locals.result = date.err;
                }
                next();
            },
            this.sendObjectResponse
        );

        app.patch(
            this.getUrlWithExtension("updateInvoiceGenerationDate"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response, next: any) => {
                const invoiceConfigDto: InvoiceConfigDto = request.body;

                response.locals.result =
                    await ConfigDatabase.updateInvoiceGenerationDate(
                        invoiceConfigDto
                    );

                if (response.locals.result.ok) {
                    CronJobManager.getInstance().resetInvoiceGenerationDateJob();
                }

                next();
            },
            this.sendObjectResponse
        );
    }
}
