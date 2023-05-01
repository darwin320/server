import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { ServiceDatabase } from "../../db/serviceDatabase";
import { ApiEndpoint } from "../api/apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";

export class ServicesApiEndpoint extends ApiEndpoint {
    constructor() {
        super("services");
        
    }

    public getElements(app: any): void {
        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (_request: Request, response: Response) => {
                
                const result = await ServiceDatabase.getServices();
                response.send(result); 
            }
        );
    } 

    public getElementsType(app: any): void {
        app.post(
            this.getUrlWithExtension("typeservices"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const result = await ServiceDatabase.getTypeServices();
                
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
 
                const result = await ServiceDatabase.searchService(
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
            this.getUrlWithExtension(":serviceId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const serviceId = parseInt(request.params["serviceId"]);
                const result = await ServiceDatabase.getServiceById(serviceId);

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
                const result = await ServiceDatabase.createService({
                    nameService: request.body.nameService,
                    typeService: request.body.typeService,
                    nameSupplier : request.body.nameSupplier,
                    company:       request.body.company,
                    phoneNumber: request.body.phoneNumber,
                    description: request.body.description,
                    price: request.body.price
                });
                response.send(result);
            }
        );

        
    }

    public updateElement(app: any): void {
          app.put(
            this.getUrlWithExtension("update/:serviceId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const serviceId = parseInt(request.params["serviceId"]);
                const changes = request.body;

                const result = await ServiceDatabase.updateServiceById(
                    serviceId,
                    changes
                );
                response.send(result);
            }
        );
    }

    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:serviceId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const serviceId = parseInt(request.params["serviceId"]);

                const result = await ServiceDatabase.deleteServiceById(
                    serviceId
                );
                response.send(result);
            }
        );
    }


    public registerCustomMethods(_app: any): void {}
}
