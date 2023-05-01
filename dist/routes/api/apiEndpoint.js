"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiEndpoint = void 0;
const DEFAULT_ERROR_CODE = 409;
class ApiEndpoint {
    constructor(name) {
        this.name = name;
    }
    getUrl() {
        return `/api/${this.name}`;
    }
    getUrlWithExtension(extension) {
        return `${this.getUrl()}/${extension}`;
    }
    registerMethods(app) {
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
    sendObjectResponse(_request, response) {
        const result = response.locals.result;
        if (result.ok) {
            response.send(result.unwrap());
        }
        else {
            response.status(DEFAULT_ERROR_CODE).send(result.val);
        }
    }
    sendOkResponse(_request, response) {
        const result = response.locals.result;
        if (result.ok) {
            // FIXME: This is ugly, we have to find a way to make this seem better,
            // because the status is just an object.
            response.status(200).send({
                ok: "OK",
            });
        }
        else {
            response.status(DEFAULT_ERROR_CODE).send(result.val);
        }
    }
}
exports.ApiEndpoint = ApiEndpoint;
