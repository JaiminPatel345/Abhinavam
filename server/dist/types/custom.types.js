// utils/AppError.ts
export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}
export const formatResponse = (success, message, data) => ({
    success,
    message,
    data
});
//# sourceMappingURL=custom.types.js.map