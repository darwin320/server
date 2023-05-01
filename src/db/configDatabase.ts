import { Config, PrismaClient } from "@prisma/client";
import { Err, Ok, Result } from "ts-results";
import { DEFAULT_CONFIG } from "../models/config";
import { InvoiceConfigDto } from "../routes/api/configApi";
import { withPrismaClient } from "./database";

export namespace ConfigDatabase {
    export async function getInvoiceGenerationDate(): Promise<
        Result<Config, Error>
    > {
        try {
            return Ok(
                await withPrismaClient(async (prisma: PrismaClient) => {
                    const result =
                        (await prisma.config.findUnique({
                            where: {
                                key: DEFAULT_CONFIG.invoiceGenerationDay.key,
                            },
                        })) ?? null;

                    if (result) {
                        return result;
                    } else {
                        throw new Error();
                    }
                })
            );
        } catch (error: any) {
            return Err(error);
        }
    }

    export async function updateInvoiceGenerationDate(
        invoice: InvoiceConfigDto
    ): Promise<Result<Config, Error>> {
        try {
            return Ok(
                await withPrismaClient(async (prisma: PrismaClient) => {
                    return await prisma.config.update({
                        where: {
                            key: DEFAULT_CONFIG.invoiceGenerationDay.key,
                        },
                        data: {
                            value: invoice.date.toString(),
                        },
                    });
                })
            );
        } catch (error: any) {
            return Err(error);
        }
    }
}
