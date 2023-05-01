export type ErrorResponse = {
    code: string;
    message: string;
};

export namespace Errors {
    export function getErrorFromCode(code: string): ErrorResponse {
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
                    message:
                        "The hardware element is already assigned to a client or zone.",
                };
            default:
                return {
                    code: "UNKNOWN",
                    message: "Unknown error or not registered.",
                };
        }
    }
}
