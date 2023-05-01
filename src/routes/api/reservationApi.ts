import { Request, Response } from "express";
import { logMotion } from "../../audit/audit";
import { ReservationDatabase } from "../../db/reservationDatabase";
import { ApiEndpoint } from "../api/apiEndpoint";
import { authorize, authorizeOnRole } from "../auth";
import { PrismaClient } from "@prisma/client";

export class ReservationApiEndpoint extends ApiEndpoint {


    constructor() {
        super("reservations");
        
    }

    public getElements(app: any): void {
        app.get(
            this.getUrl(),
            authorize,
            authorizeOnRole,
            async (_request: Request, response: Response) => {
                const result = await ReservationDatabase.getReservations();
                response.send(result); 
            }
        );
    }
    public getElementsType(app: any): void {
        //throw new Error("Method not implemented.");
        app.post(
            this.getUrlWithExtension("typeSalon"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const result = await ReservationDatabase.getTypeSalon();
                response.send(result);
            }
        );
    }
    public searchElements(app: any): void {
        //throw new Error("Method not implemented.");
        app.post(
            
            this.getUrlWithExtension("search"),
            authorize,
            authorizeOnRole,
            
            async (request: Request, response: Response) => {
                
                const search = request.body.userSearch;
                const skip = request.body.skip;
                const take = request.body.take; 
 
                const result = await ReservationDatabase.searchReservation(
                    search,
                    skip,
                    take
                );
                response.send(result);
            }
        );
    }

    
    public getElementById(app: any): void {
        //throw new Error("Method not implemented.");
        app.get(
            this.getUrlWithExtension(":reservationId"),
            authorize,
            authorizeOnRole,
            async (request: Request, response: Response) => {
                const reservationId = parseInt(request.params["reservationId"]);
                const result = await ReservationDatabase.getReservationById(reservationId);
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
                const result = await ReservationDatabase.createReservation({
                    idUser: request.body.idUser,
                    nameClient: request.body.nameClient,
                    salon : request.body.salon,
                    cantidadAdultos: request.body.cantidadAdultos,
                    cantidadNinos: request.body.cantidadNinos,
                    fecha: request.body.fecha,
                    fechaFin : request.body.fechaFin,
                    horaInicio: request.body.horaInicio,
                    horaFin: request.body.horaFin,
                    tipoEvento : request.body.tipoEvento,
                    downPayment: request.body.downPayment,
                    priceRoomPerHour: request.body.priceRoomPerHour,
                    inventory: request.body.inventory
                });
                response.send(result); 
               
            }
        );
       // throw new Error("Method not implemented.");
    }
    public updateElement(app: any): void {
        app.put(
            this.getUrlWithExtension("update/:reservationId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const reservationId = parseInt(request.params["reservationId"]);
                const { id, inventario, ...changes } = request.body;
    
                const result = await ReservationDatabase.updateReservationById(
                    reservationId,
                    changes
                );
    
                if (inventario && inventario.servicios) {
                    console.log(inventario.servicios)
                    const updatedServices = await ReservationDatabase.updateServices(inventario.servicios);
    
                    const prisma = new PrismaClient();
    
                    const serviceIds = [];
                    for (const inv of inventario.servicios) {
                        // Verificar si el servicio ya está asociado con la reservación actual
                        const existingInventory = await prisma.inventory.findUnique({
                            where: { id: inventario.id },
                            include: { servicios: true },
                        });
    
                        let existingService;
                        if (existingInventory) {
                            existingService = existingInventory.servicios.find(service => service.id === inv.id);
                        }
    
                        if (existingService) {
                            // Si el servicio ya está asociado, actualizarlo
                            await prisma.service.update({
                                where: { id: inv.id },
                                data: {
                                    nameService: inv.nameService,
                                    typeService: inv.typeService,
                                    nameSupplier: inv.nameSupplier,
                                    company: inv.company,
                                    phoneNumber: inv.phoneNumber,
                                    description: inv.description,
                                    inventory: {
                                        connect: {
                                            id: inventario.id,
                                        },
                                    },
                                    price: Number(inv.price),
                                },
                            });
                        } else {
                            // Si no está asociado, crear un nuevo servicio y conectarlo con el inventario
                            const newService = await prisma.service.create({
                                data: {
                                    nameService: inv.nameService,
                                    typeService: inv.typeService,
                                    nameSupplier: inv.nameSupplier,
                                    company: inv.company,
                                    phoneNumber: inv.phoneNumber,
                                    description: inv.description,
                                    inventory: {
                                        connect: {
                                            id: inventario.id,
                                        },
                                    },
                                    price: Number(inv.price),
                                },
                            });
    
                            serviceIds.push({ id: newService.id });
                        }
                    }
    
                    // Conectar el nuevo servicio (copia) con el inventario en lugar del servicio original
                    await prisma.inventory.update({
                        where: { id: inventario.id },
                        data: { servicios: { connect: serviceIds } },
                    });
                }
    
                response.send(result);
            }
        );
        //throw new Error("Method not implemented.");
    }
    
    
    
    
    public deleteElement(app: any): void {
        app.delete(
            this.getUrlWithExtension("delete/:ReservationId"),
            authorize,
            authorizeOnRole,
            logMotion,
            async (request: Request, response: Response) => {
                const reservationId = parseInt(request.params["ReservationId"]);

                const result = await ReservationDatabase.deleteReservationById(
                    reservationId
                );
                response.send(result);
            }
        );
        //throw new Error("Method not implemented.");
    }
    public registerCustomMethods(app: any): void {
       // throw new Error("Method not implemented.");
       app.post(
        this.getUrlWithExtension("typeEvent"),
        authorize,
        authorizeOnRole,
        async (request: Request, response: Response) => {
            const result = await ReservationDatabase.getTypeEvent();
            response.send(result);
        }
    );
    }
 
}