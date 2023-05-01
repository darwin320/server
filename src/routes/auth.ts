import  {NextFunction,Request,Response} from 'express';
import { compareSync } from "bcrypt";
import passport, { use } from "passport";
import { Strategy } from "passport-local";
import { UserDatabase } from "../db/userDatabase";
import { canRoleExecuteMethod,getUserRolePermissionsOnAPI} from "../auth/permissions"
import jwt from 'jsonwebtoken';
import { User as PrismaUser } from '@prisma/client';

interface User extends PrismaUser {
    token?: string;
  }

  interface AuthenticatedUser {
    user: User;
    token: string;
    toJson(): object;
  }

  

passport.use(
    "local",
    new Strategy(
        {
            usernameField: "email",
            passwordField: "password",
        },
        async function verify(email, password, done) {
            
            const user = await UserDatabase.getUserByEmail(email);
            if (user) {
                if (compareSync(password, user.password)) {
                    const token = jwt.sign({ userId: user.id }, "Claralia");
                   
                    return done(null, { user: user as User, token });
                } else {
                    return done(null, false, {
                        message: "Incorrect password",
                    });
                }
            } else {
                return done(null, false, {
                    message: "Incorrect username",
                });
            }
        }
    )
);

passport.serializeUser((user: any | User, done) => {
    const us = user
    done(null, us.user.id);
});

passport.deserializeUser(async (id: number, done) => {
    const user = await UserDatabase.getUserById(id);
    done(null, user);
});

export function authorize(
    
    request: Request,
    response: Response,
    next: NextFunction
    
) {
    
    if (request.user) { 
        
        next();
    } else {
        response.sendStatus(401);
    }
}

export async function authorizeOnRole(
    request: Request,
    response: Response,
    next: NextFunction
    
) {
    const user = request.user;
    const token = request.headers.authorization?.split(" ")[1]?.replace(/^"|"$/g, "");
    const check = user && token;
   
    if (request.user) {
     
        const decodedToken = jwt.verify(token!, "Claralia") as { userId: number, };
        const userId = decodedToken.userId;
        const dbUser = await UserDatabase.getUserById(userId);
     
        
       
        // You see all of this?
        // All of this is needed so we take the second part of the url to see
        // if the user has permission to the API route. So, take a look a this
        // example:
        //
        // /api/users: This should list the users, but how we make sure that
        // we get the 'users' part? That's why this is done.
        //s
        // First, we replace the empty spaces, just to be safe, then we split
        // the url. After that, we remove the empty values from the array and
        // we get the second element and boom. We got it.
        
        const routeApi = request.route.path
            .replace(/ /g, "")
            .split("/")
            .filter((e: string) => e.length > 0)[1];
        // ====================================================================

        const permission = await getUserRolePermissionsOnAPI(
            (request.user as User).id,
            // This is needed so the arguments, queries and such, don't kill this.
            routeApi
        );
       

      
        
        // Check if the permission exists and then if the role can execute that
        // permission.
        if (permission && canRoleExecuteMethod(permission, request.method) && dbUser) {
            request.user = dbUser;
            next();
        }else {
            response.sendStatus(401);
        }
    } else {
        response.sendStatus(401);
    }
}


export function configureAuthModule(app: any) {
    app.post(
        "/login/password",
        passport.authenticate("local", {
            failureMessage: true,
            successMessage: true,
        }),
        
        (req: Request, res: Response) => {
            const user = req.user as AuthenticatedUser;
            res.status(200).json({ token: user.token });
            
        }
    );

    app.get("/auth/canActivate", authorize, (_: Request, response: Response) =>
        response.sendStatus(200)
    );

    app.post(
        "/logout",
        authorize,
        (request: Request, response: Response, next: NextFunction) => {
            request.session.destroy((_) => {
                response.sendStatus(200);
            });
        }
    );
}
