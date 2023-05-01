import { Role } from "@prisma/client";

export const DEFAULT_ROLES: {
    superAdmin: Role;
} = {
    superAdmin: {
        id: 1,
        name: "SuperAdmin",
    },
};
