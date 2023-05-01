import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

import { withPrismaClient } from "../db/database";

/**
 * This function is used to save the movements done in the page. As this
 * is a middleware, we have to choose which movements we want to save.
 * */
export async function logMotion(
    request: Request,
    _: Response,
    next: NextFunction
) {
    withPrismaClient(async (prisma) => {
        await prisma.action.create({
            data: {
                method: request.method,
                url: request.route.path,
                date: new Date(),
                userEmail: (request.user as User).email,
            },
        });

        next();
    });
}
