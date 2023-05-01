"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobManager = void 0;
const node_schedule_1 = require("node-schedule");
const configDatabase_1 = require("../db/configDatabase");
const config_1 = require("../models/config");
class CronJobManager {
    constructor() {
        this.resetInvoiceGenerationDateJob();
    }
    static getInstance() {
        if (!CronJobManager.instance) {
            CronJobManager.instance = new CronJobManager();
        }
        return CronJobManager.instance;
    }
    resetInvoiceGenerationDateJob() {
        if (this.invoiceGenerationJob) {
            this.invoiceGenerationJob.cancel();
            delete this.invoiceGenerationJob;
        }
        configDatabase_1.ConfigDatabase.getInvoiceGenerationDate().then((config) => {
            if (config.ok) {
                const invoiceGenerationDate = new Date(config.val.value);
                this.invoiceGenerationJob = (0, node_schedule_1.scheduleJob)(invoiceGenerationDate, 
                // TODO: We should move this somewhere else.
                () => __awaiter(this, void 0, void 0, function* () {
                    // This order is important, first we need to generate
                    // the invoice date, so when we generate the invoices
                    // the next date for the payment is shown.
                    yield configDatabase_1.ConfigDatabase.updateInvoiceGenerationDate({
                        date: (0, config_1.getNextInvoiceGenerationDate)(),
                    });
                    this.resetInvoiceGenerationDateJob();
                }));
            }
        });
    }
}
exports.CronJobManager = CronJobManager;
