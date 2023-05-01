"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = void 0;
var Errors;
(function (Errors) {
    function getErrorFromCode(code) {
        switch (code) {
            case "LSUE":
                return {
                    code: "LSUE",
                    message: "Can't remove or update last Super User.",
                };
            case "CDCUE":
                return {
                    code: "CDCUE",
                    message: "Can't delete current user error.",
                };
            case "P2002":
                return {
                    code: "UCDE",
                    message: "Unique constraint database error.",
                };
            case "HAAE":
                return {
                    code: "HAAE",
                    message: "The hardware element is already assigned to a client or zone.",
                };
            default:
                return {
                    code: "UNKNOWN",
                    message: "Unknown error or not registered.",
                };
        }
    }
    Errors.getErrorFromCode = getErrorFromCode;
})(Errors = exports.Errors || (exports.Errors = {}));
