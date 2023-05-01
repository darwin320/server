import { PrismaClient, Role, User } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt";
import { Err, Ok, Result } from "ts-results";
import { ErrorResponse, Errors } from "../models/errors/errors";
import { DEFAULT_ROLES } from "../models/role";

import { SearchResult, SEARCH_AMOUNT, withPrismaClient } from "./database";

export namespace UserDatabase {
    export async function getUserByEmail(email: string): Promise<User | null> {
        return await withPrismaClient<User | null>(
            async (prisma: PrismaClient) => {
                const user = await prisma.user.findUnique({
                    where: {
                        email,
                    },
                });

                return user ?? null;
            }
        );
    }

    export async function getUserById(id: number, withRole = false) {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            return await prisma.user.findUnique({
                where: {
                    id,
                },
                include: {
                    role: withRole,
                },
            });
        });
    }

    export async function createUser(userInformation: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: Role;
    }): Promise<Result<User, ErrorResponse>> {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            try {
                const user = await prisma.user.create({
                    data: {
                        firstName: userInformation.firstName,
                        lastName: userInformation.lastName,
                        email: userInformation.email,
                        password: hashSync(
                            userInformation.password,
                            genSaltSync(10)
                        ),
                        roleId: userInformation.role.id,
                    },
                });
                return Ok(user);
            } catch (error: any) {
                return Err(Errors.getErrorFromCode(error.code));
            }
        });
    }

    export async function deleteUser(
        id: number
    ): Promise<Result<User, ErrorResponse>> {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            try {
                if (id === DEFAULT_ROLES.superAdmin.id) {
                    if (!(await platformHasMoreThanOneSuperUser(prisma))) {
                        return Err(Errors.getErrorFromCode("LSUE"));
                    }
                }

                const deletedUser = await prisma.user.delete({
                    where: {
                        id,
                    },
                });
                return Ok(deletedUser);
            } catch (error: any) {
                return Err(Errors.getErrorFromCode(error.code));
            }
        });
    }

    export async function updateUser(
        userToChangeId: number,
        userChanges: any
    ): Promise<Result<User, ErrorResponse>> {
        return await withPrismaClient(async (prisma: PrismaClient) => {
            if (await canUpdateUser(prisma, userToChangeId, userChanges)) {
                try {
                    const updatedUser = await prisma.user.update({
                        where: {
                            id: userToChangeId,
                        },
                        data: {
                            firstName: userChanges.firstName,
                            lastName: userChanges.lastName,
                            email: userChanges.email,
                            roleId: userChanges.role.id,
                        },
                    });

                    return Ok(updatedUser);
                } catch (error: any) {
                    return Err(Errors.getErrorFromCode(error.code));
                }
            } else {
                return Err(Errors.getErrorFromCode("LSUE"));
            }
        });
    }

    export async function searchUser(
        search: string = "",
        skip?: number,
        take?: number
    ): Promise<SearchResult<User>> {
        return await withPrismaClient<SearchResult<User>>(
            async (prisma: PrismaClient) => {
                let whereQuery = null;

                if (search.length > 0) {
                    whereQuery = {
                        OR: [
                            {
                                firstName: {
                                    contains: search,
                                },
                            },
                            {
                                lastName: {
                                    contains: search,
                                },
                            },
                            {
                                email: {
                                    contains: search,
                                },
                            },
                        ],
                    };
                }
                const userCount = await prisma.user.count({
                    where: whereQuery ?? {},
                });
                const users = await prisma.user.findMany({
                    where: whereQuery ?? {},
                    include: {
                        role: true,
                    },
                    skip: skip ?? 0,
                    take: take ?? SEARCH_AMOUNT,
                });

                return {
                    search: users,
                    searchCount: userCount,
                };
            }
        );
    }

    /**
     * Checks if there is more than 1 super user when deleting or updating an user
     * if it is the last super user, the role can't be changed or removed.
     */
    async function canUpdateUser(
        prisma: PrismaClient,
        userToChangeId: number,
        changes: any
    ): Promise<boolean> {
        const userToChange = await prisma.user.findUnique({
            where: {
                id: userToChangeId,
            },
        });

        // If the user that we are trying to change is a Super Admin we have to
        // check:
        //
        // 1. If the user wants to change the role, check if there is more than
        // one super user.
        if (userToChange?.roleId === DEFAULT_ROLES.superAdmin.id) {
            // This means the user is changing the role of the user
            if (changes.role.id !== DEFAULT_ROLES.superAdmin.id) {
                return platformHasMoreThanOneSuperUser(prisma);
            }
        }
        return true;
    }

    async function platformHasMoreThanOneSuperUser(prisma: PrismaClient) {
        const superUsers = await prisma.user.findMany({
            where: {
                roleId: DEFAULT_ROLES.superAdmin.id,
            },
        });

        return superUsers.length > 1;
    }
}
