"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNextInvoiceGenerationDate = exports.DEFAULT_CONFIG = void 0;
const luxon_1 = require("luxon");
exports.DEFAULT_CONFIG = {
    invoiceGenerationDay: {
        key: "invoiceGenerationDay",
        value: getNextInvoiceGenerationDate(new Date()).toString(),
    },
};
function getNextInvoiceGenerationDate(currentDate = new Date()) {
    return luxon_1.DateTime.fromJSDate(currentDate)
        .plus({
        months: 1,
    })
        .toJSDate();
}
exports.getNextInvoiceGenerationDate = getNextInvoiceGenerationDate;
