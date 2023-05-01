import { PrismaClient, Service, TypeService } from "@prisma/client";
import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace ServiceDatabase {
    export async function createService(serviceInformation: {
        nameService: string;
        typeService: TypeService;
        nameSupplier: string;
        company: string;
        phoneNumber: string;
        description: string;
        price: number
       
    }) {
        return await withPrismaClient<Service | null>(
            async (prisma: PrismaClient) => {
                const service = await prisma.service.create({
                    data: {
                        nameService: serviceInformation.nameService,
                        typeService: serviceInformation.typeService,
                        nameSupplier : serviceInformation.nameSupplier,
                        company:       serviceInformation.company,
                        phoneNumber: serviceInformation.phoneNumber,
                        description: serviceInformation.description,
                        price: serviceInformation.price
                    },
                });
                return service ?? null;
            }
        );
    }

    export async function getTypeServices() { 
        return await withPrismaClient<TypeService[]>(
            async (prisma: PrismaClient) => {
                return await Object.values(TypeService);
            }
        );
    }

    export async function getServices() { 
        return await withPrismaClient<Service[]>(
            async (prisma: PrismaClient) => {
                const xd =  await prisma.service.findMany({
                    where: {
                      inventory: {
                        none: {},
                      },
                    },
                  });
                  return xd;
            }
        );
    }

    

    export async function getServiceById(serviceId: number) {
        return await withPrismaClient<Service | null>(
            async (prisma: PrismaClient) => {
                return await prisma.service.findUnique({
                    where: {
                        id: serviceId,
                    },
                    
                });
            }
        );
    }
    
    export async function deleteServiceById(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
                return await prisma.service.delete({
                    where: {
                        id,
                    },
                });
        });
    }

    export async function updateServiceById(id: number, changes: Service) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.service.update({
                where: {
                    id,
                },
                data: changes,
            });
        });
    }

    export async function searchService(
        search: string = "",
        skip?: number,
        take?: number
      ) {
        return await withPrismaClient<SearchResult<Service>>(
          async (prisma: PrismaClient) => {
            let whereQuery = null;
      
            // Obtener todos los ids de los servicios que tienen al menos un inventario asociado
            const servicesWithInventory = await prisma.service.findMany({
              where: {
                inventory: {
                  some: {}
                }
              },
              select: {
                id: true
              }
            });
            const serviceIdsWithInventory = servicesWithInventory.map(
              (service) => service.id
            );
      
            if (search.length > 0) {
              whereQuery = {
                NOT: {
                  id: {
                    in: serviceIdsWithInventory
                  },
                  nameService: {
                    contains: search,
                  },
                },
              };
            } else {
              whereQuery = {
                NOT: {
                  id: {
                    in: serviceIdsWithInventory
                  }
                }
              };
            }
      
            const serviceCount = await prisma.service.count({
              where: whereQuery ?? {},
            });
            const services = await prisma.service.findMany({
              where: whereQuery ?? {},
              skip: skip ?? 0,
              take: take ?? SEARCH_AMOUNT,
            });
      
            return {
              search: services,
              searchCount: serviceCount,
            };
          }
        );
      }
      
      
}

  