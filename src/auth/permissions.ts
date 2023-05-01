import { ApisOnRoles } from "@prisma/client";
import { Console } from "console";

import { ApiDatabase } from "../db/apiDatabase";
import { UserDatabase } from "../db/userDatabase";

/**
 * Use the user role, API route, to get the permissions the user has on that
 * route.
 */
export async function getUserRolePermissionsOnAPI(
    userId: number,
    apiName: string
): Promise<ApisOnRoles | null> {
    const validatedUser = await UserDatabase.getUserById(userId);
    const validatedApi = await ApiDatabase.getApi(apiName);
    if (validatedUser && validatedApi) {
        return await ApiDatabase.getApisOnRolesById(
            
            validatedApi.id,
            validatedUser.roleId
            
        );

    } else {
        return null;
    }
}

export function canRoleExecuteMethod(
    permission: ApisOnRoles,
    request: string
): boolean {
    switch (request) {
        case "GET":
            return permission.get;
        case "PATCH":
        case "PUT":
            // FIXME: This PUT case is very important, we could just add another value
            // to the model and database, but for the moment we need to have this
            // working. So if the user can post, it means that it can also update
            // values.
        case "POST":
            return permission.post;
        case "DELETE":
            return permission.delete;
        default:
            // When other method is requested but we aren't using it.
            return false;
    }
}
