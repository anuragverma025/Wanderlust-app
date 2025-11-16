class ExpressError extends Error {
    constructor(statusCode = 500, message) {
        super(message);
        console.log("ExpressError ctor:", { messageType: typeof message, message, statusCodeType: typeof statusCode, statusCode });
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;