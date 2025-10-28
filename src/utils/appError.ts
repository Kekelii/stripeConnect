// utils/AppError.ts
export class AppError extends Error {
    statusCode: number
    isOperational: boolean

    constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true // helps distinguish expected errors from programming bugs

        // Maintains proper stack trace in V8 engines
        Error.captureStackTrace(this, this.constructor)
    }
}
