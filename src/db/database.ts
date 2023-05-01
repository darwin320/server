import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

// This constant will determine the amount of searches made in the database. This
// should be used for every API where you want to make a search, so by default
// we will search SEARCH_AMOUNT elements in the database at max.
//
// This is only a recomended amount, you can use the value you want, if the API
// needs a bigger or lower default.
export const SEARCH_AMOUNT = 30;

export async function withPrismaClient<T>(
    callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
    await prisma.$connect();
    const result = await callback(prisma);
    await prisma.$disconnect();
    //console.log("finalapi:" + result);
    return result;
}

export interface SearchResult<T> {
    search: T[];
    searchCount: number;
}
