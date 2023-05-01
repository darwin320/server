import { Job, scheduleJob } from "node-schedule";
import { ConfigDatabase } from "../db/configDatabase";
import { getNextInvoiceGenerationDate } from "../models/config";

export class CronJobManager {
    private static instance: CronJobManager;

    private invoiceGenerationJob?: Job;

    private constructor() {
        this.resetInvoiceGenerationDateJob();
    }

    public static getInstance(): CronJobManager {
        if (!CronJobManager.instance) {
            CronJobManager.instance = new CronJobManager();
        }

        return CronJobManager.instance;
    }

    public resetInvoiceGenerationDateJob() {
        if (this.invoiceGenerationJob) {
            this.invoiceGenerationJob.cancel();
            delete this.invoiceGenerationJob;
        }

        ConfigDatabase.getInvoiceGenerationDate().then((config) => {
            if (config.ok) {
                const invoiceGenerationDate = new Date(config.val.value);

                this.invoiceGenerationJob = scheduleJob(
                    invoiceGenerationDate,
                    // TODO: We should move this somewhere else.
                    async () => {
                        // This order is important, first we need to generate
                        // the invoice date, so when we generate the invoices
                        // the next date for the payment is shown.
                        await ConfigDatabase.updateInvoiceGenerationDate({
                            date: getNextInvoiceGenerationDate(),
                        });

                        


                        this.resetInvoiceGenerationDateJob();
                    }
                );
            }
        });
    }
}
