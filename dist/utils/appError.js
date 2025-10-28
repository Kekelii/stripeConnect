// utils/AppError.ts
export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // helps distinguish expected errors from programming bugs
        // Maintains proper stack trace in V8 engines
        Error.captureStackTrace(this, this.constructor);
    }
}
//# sourceMappingURL=appError.js.map