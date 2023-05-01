import { PrismaClient, Role } from "@prisma/client";
import { DEFAULT_ROLES } from "../models/role";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace RoleDatabase {
    export async function updateRoleById(id: number, changes: Role) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            if (await canUpdateRole(id)) {
                return await prisma.role.update({
                    where: {
                        id,
                    },
                    data: changes,
                });
            } else {
                throw new Error("Can't update role!");
            }
        });
    }

    export async function deleteRoleById(id: number) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            if (await canDeleteRole(prisma, id)) {
                return await prisma.role.delete({
                    where: {
                        id,
                    },
                });
            } else {
                throw new Error("Can't delete role!");
            }
        });
    }

    export async function getRoleById(id: number): Promise<Role | null> {
        return await withPrismaClient<Role | null>(
            async (prisma: PrismaClient) => {
                const role = await prisma.role.findUnique({
                    where: {
                        id: id,
                    },
                    include: {
                        apisOnRoles: {
                            include: {
                                api: true,
                            },
                        },
                    },
                });

                return role ?? null;
            }
        );
    }

    export async function getRoles(): Promise<Role[]> {
        return await withPrismaClient<Role[]>(async (prisma: PrismaClient) => {
            const roles = await prisma.role.findMany();

            return roles;
        });
    }

    export async function createRole(name: string): Promise<Role | null> {
        return await withPrismaClient<Role | null>(
            async (prisma: PrismaClient) => {
                const role = await prisma.role.create({
                    data: {
                        name,
                    },
                });

                return role ?? null;
            }
        );
    }

    export async function searchRole(
        search: string = "",
        skip?: number,
        take?: number
    ): Promise<SearchResult<Role>> {
        return await withPrismaClient<SearchResult<Role>>(
            async (prisma: PrismaClient) => {
                let whereQuery = null;

                if (search.length > 0) {
                    whereQuery = {
                        name: {
                            contains: search,
                        },
                    };
                }

                const roleCount = await prisma.role.count({
                    where: whereQuery ?? {},
                });
                const roles = await prisma.role.findMany({
                    where: whereQuery ?? {},
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: roles,
                    searchCount: roleCount,
                };
            }
        );
    }
}

async function canDeleteRole(
    prisma: PrismaClient,
    id: number
): Promise<boolean> {
    if (id === DEFAULT_ROLES.superAdmin.id) {
        return false;
    }

    const users = await prisma.user.findMany({
        where: {
            roleId: id,
        },
    });
    // This means that if there is an user with this role, we can't delete the
    // role.
    return users.length === 0;
}

async function canUpdateRole(id: number): Promise<boolean> {
    return id !== DEFAULT_ROLES.superAdmin.id;
}
