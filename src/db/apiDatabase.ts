import { Api, ApisOnRoles, PrismaClient } from "@prisma/client";
import { DEFAULT_ROLES } from "../models/role";

import { withPrismaClient } from "./database";

export namespace ApiDatabase {
    export async function updateApisOnRoles(changes: ApisOnRoles) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            // If it's the super user, don't update
            if (changes.roleId === DEFAULT_ROLES.superAdmin.id) {
                return;
            }

            return await prisma.apisOnRoles.update({
                where: {
                    apiId_roleId: {
                        apiId: changes.apiId,
                        roleId: changes.roleId,
                    },
                },
                data: {
                    get: changes.get,
                    post: changes.post,
                    delete: changes.delete,
                },
            });
        });
    }

    export async function getApi(name: string): Promise<Api | null> {
        return await withPrismaClient<Api | null>(
            async (prisma: PrismaClient) => {
                const api = await prisma.api.findUnique({
                    where: {
                        name,
                    },
                });
                return api ?? null;
            }
        );
    }

    export async function getApis(): Promise<Api[]> {
        return await withPrismaClient<Api[]>(async (prisma: PrismaClient) => {
            const apis = await prisma.api.findMany();

            return apis;
        });
    }

    export async function createApisOnRoles(
        apiId: number,
        roleId: number
    ): Promise<ApisOnRoles | null> {
        return await withPrismaClient<ApisOnRoles | null>(
            async (prisma: PrismaClient) => {
                const apisOnRoles = await prisma.apisOnRoles.create({
                    data: {
                        apiId,
                        roleId,
                    },
                });

                return apisOnRoles ?? null;
            }
        );
    }

    export async function getApisOnRolesByRoleId(
        roleId: number
    ): Promise<ApisOnRoles[]> {
        return await withPrismaClient<ApisOnRoles[]>(
            async (prisma: PrismaClient) => {
                const apisOnRoles = await prisma.apisOnRoles.findMany({
                    where: {
                        roleId,
                    },
                    include: {
                        api: true,
                    },
                });

                return apisOnRoles;
            }
        );
    }

    export async function getApisOnRolesById(
        apiId: number,
        roleId: number
    ): Promise<ApisOnRoles | null> {
        return await withPrismaClient<ApisOnRoles | null>(
            async (prisma: PrismaClient) => {
                const apisOnRoles = await prisma.apisOnRoles.findUnique({
                    where: {
                        apiId_roleId: {
                            apiId: apiId,
                            roleId: roleId,
                        },
                    },
                
                });

                return apisOnRoles ?? null;
            }
        );
    }
}
