import {PrismaClient ,Reservacion,TypeSalon,TypeEvent,Inventory,TypeService,Service} from "@prisma/client";
import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";


export namespace ReservationDatabase{

    export async function getReservations() { 
        return await withPrismaClient<Reservacion[]>(
            async (prisma: PrismaClient) => {
                return await prisma.reservacion.findMany({
                    include: {inventario:true}
                });
            }
        );
    }

    export async function getTypeEvent() { 
        return await withPrismaClient<TypeEvent[]>(
            async (prisma: PrismaClient) => {
                return await Object.values(TypeEvent);
            }
        );
    }

    export async function getTypeSalon() { 
        return await withPrismaClient<TypeSalon[]>(
            async (prisma: PrismaClient) => {
                return await Object.values(TypeSalon);
            }
        );
    }



    export async function getInventoryWithServices(idReservation: number) {
        return await withPrismaClient<Inventory | null>(
            async (prisma: PrismaClient) => {
                return await prisma.inventory.findUnique({
                    where: {
                        reservacionId: idReservation,
                    },
                    include: {servicios:true},
                });
                
            }
        );
    }
    



    export async function searchReservation(
        search: string = "",
        skip?: number,
        take?: number
    ) {
        return await withPrismaClient<SearchResult<Reservacion>>(
            async (prisma: PrismaClient) => {
                let whereQuery = null;

                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                nameClient: {
                                    contains: search,
                                },
                            },
                        ],
                    };
                }

                whereQuery = {
                    ...whereQuery,
                    state: true, // Agrega el filtro para state en true
                };

                const serviceCount = await prisma.reservacion.count({
                    where: whereQuery ?? {},
                });
                const reservacions = await prisma.reservacion.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: reservacions,
                    searchCount: serviceCount,
                };
            }
        );
    }


   

    export async function deleteReservationById(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {

            const reservation = await prisma.reservacion.update({
                where: {
                    id,
                },
                data: {
                    state: false,
                },
            });        
        });
    }



    export async function createReservation(reservationInformation: {
        idUser:number;
        nameClient: string;
        salon: TypeSalon;
        cantidadAdultos: number;
        cantidadNinos: number;
        fecha: string;
        fechaFin: string;
        horaInicio: Date;
        horaFin: Date;
        tipoEvento: TypeEvent;
        downPayment: number;
        priceRoomPerHour: number;
        inventory: Service[]
    }) {
        const prisma = new PrismaClient();
      
        try {
          const reservation = await prisma.reservacion.create({
            data: {
              idUser: reservationInformation.idUser,
              nameClient: reservationInformation.nameClient,
              salon: reservationInformation.salon,
              cantidadAdultos: reservationInformation.cantidadAdultos,
              cantidadNinos: reservationInformation.cantidadNinos,
              fecha: reservationInformation.fecha,
              fechaFin: reservationInformation.fechaFin,
              horaInicio: reservationInformation.horaInicio,
              horaFin: reservationInformation.horaFin,
              tipoEvento: reservationInformation.tipoEvento,
              downPayment: reservationInformation.downPayment,
              priceRoomPerHour: reservationInformation.priceRoomPerHour,
            },
          });
      
          const inventory = await prisma.inventory.create({
            data: {
              reservacionId: reservation.id,
            },
          });
      
          const serviceIds = [];
          for (const inv of reservationInformation.inventory) {
            const service = await prisma.service.create({
              data: {
                nameService: inv.nameService,
                typeService: inv.typeService,
                nameSupplier: inv.nameSupplier,
                company: inv.company,
                phoneNumber: inv.phoneNumber,
                description: inv.description,
                inventory: {
                  connect: {
                    id: inventory.id,
                  },
                },
                price: Number(inv.price) 
              },
            });
      
            serviceIds.push({ id: service.id });
        
          }
      
          await prisma.inventory.update({
            where: { id: inventory.id },
            data: { servicios: { connect: serviceIds } },
          });

          
      
          return reservation;
        } catch (error) {
          console.error(error);
          return null;
        } finally {
          await prisma.$disconnect();
        }
      }

      export async function getReservationById(reservationId: number) {
        return await withPrismaClient<Reservacion | null>(
            async (prisma: PrismaClient) => {
                const update =  await prisma.reservacion.findUnique({
                    where: {
                        id: reservationId,
                    },
                    include: {
                        inventario: {
                            include: { servicios: true }
                        }
                    },
                });     
                return update           
            }
        );
    }


    export async function updateReservationById(id: number, changes: Reservacion) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            
            return await prisma.reservacion.update({
                where: {
                    id,
                },
                include: {
                    inventario: {
                        include: { servicios: true }
                    }
                },
                data: changes,
            }); 
        });
    }

    export async function updateServices(services: Service[]) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            const updatedServices = [];
            for (const service of services) {
                const updatedServiceData = {
                    ...service,
                    price: parseFloat(service.price as unknown as string),
                };
                const updatedService = await prisma.service.update({
                    where: {
                        id: service.id,
                    },
                    data: updatedServiceData,
                });

                updatedServices.push(updatedService);
            }
            return updatedServices;
        });
    }
    
    
    
    
    

    
    
    



}