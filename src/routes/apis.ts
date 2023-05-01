
import { RolesApiEndpoint } from "../routes/api/rolesApi";
import { UsersApiEndpoint } from "../routes/api/usersApi";
import { ServicesApiEndpoint } from "./api/servicesApi";
import { ApiEndpoint } from "../routes/api/apiEndpoint";
import { ReservationApiEndpoint } from "./api/reservationApi";

export const REGISTERED_APIS: ApiEndpoint[] = [
    new RolesApiEndpoint(),
    new UsersApiEndpoint(),
    new ServicesApiEndpoint(),
    new ReservationApiEndpoint()
    
];
//CONFIGURA MODULIS
export function configureApiModule(app: any) {
    for (const api of REGISTERED_APIS) {
        api.registerMethods(app); 
    }
}
