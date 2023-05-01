import { Request, Response } from "express";
import { Result } from "ts-results";
import { ErrorResponse } from "../../models/errors/errors";

const DEFAULT_ERROR_CODE = 409;

export abstract class ApiEndpoint {
    constructor(public readonly name: string) {}

    public getUrl(): string {
        return `/api/${this.name}`;
    }

    public getUrlWithExtension(extension: string): string {
        return `${this.getUrl()}/${extension}`;
    }

    public registerMethods(app: any) {
        this.searchElements(app);

        this.getElements(app);
        this.getElementsType(app);
        // GET, POST, PUT Methods.
        this.getElementById(app);
        this.createElement(app);
        this.updateElement(app);
        this.deleteElement(app);

        this.registerCustomMethods(app);
    }

    public sendObjectResponse(_request: Request, response: Response) {
        const result: Result<any, ErrorResponse> = response.locals.result;

        if (result.ok) {
            response.send(result.unwrap());
        } else {
            response.status(DEFAULT_ERROR_CODE).send(result.val);
        }
    }

    public sendOkResponse(_request: Request, response: Response) {
        const result: Result<any, ErrorResponse> = response.locals.result;

        if (result.ok) {
            // FIXME: This is ugly, we have to find a way to make this seem better,
            // because the status is just an object.
            
            response.status(200).send({
                ok: "OK",
            });
        } else {
            response.status(DEFAULT_ERROR_CODE).send(result.val);
        }
    }

    public abstract getElements(app: any): void;

    public abstract getElementsType(app: any): void;
    

    public abstract searchElements(app: any): void;

    public abstract getElementById(app: any): void;

    public abstract createElement(app: any): void;

    public abstract updateElement(app: any): void;

    public abstract deleteElement(app: any): void;

    public abstract registerCustomMethods(app: any): void;
}
