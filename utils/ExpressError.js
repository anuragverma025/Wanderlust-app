// ...existing code...
class ExpressError extends Error {
    constructor(a, b) {
        // Support both (message, statusCode) and legacy (statusCode, message)
        let message;
        let statusCode = 500;
        if (typeof a === "string") {
            message = a;
            statusCode = typeof b === "number" ? b : 500;
        } else if (typeof a === "number") {
            statusCode = a;
            message = typeof b === "string" ? b : "Something went wrong";
        } else {
            message = String(a ?? "Something went wrong");
            statusCode = typeof b === "number" ? b : 500;
        }
        super(message);
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;
// ...existing code...