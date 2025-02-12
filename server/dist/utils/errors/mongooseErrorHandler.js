import { Error as MongooseError } from 'mongoose';
export class MongooseErrorHandler {
    static handleValidationError(error) {
        const errors = Object.values(error.errors).map(err => err.message);
        return {
            success: false,
            message: 'Validation error',
            errors,
            statusCode: 400
        };
    }
    static handleCastError(error) {
        return {
            success: false,
            message: `Invalid ${error.path}: ${error.value}`,
            statusCode: 400
        };
    }
    static handleDuplicateKeyError(error) {
        // The error object from MongoDB doesn't have proper TypeScript types for these properties
        const keyValue = error.keyValue;
        const field = Object.keys(keyValue)[0];
        const value = keyValue[field];
        return {
            success: false,
            message: `Duplicate value: ${value} for field: ${field}`,
            statusCode: 409
        };
    }
    static handle(error, res) {
        let errorResponse = null;
        switch (true) {
            // Validation errors (missing required fields, invalid formats, etc.)
            case error instanceof MongooseError.ValidationError:
                errorResponse = this.handleValidationError(error);
                break;
            // Cast errors (invalid ObjectId, wrong data type, etc.)
            case error instanceof MongooseError.CastError:
                errorResponse = this.handleCastError(error);
                break;
            // Duplicate key errors (unique constraint violations)
            case error.code === 11000:
                errorResponse = this.handleDuplicateKeyError(error);
                break;
            // Version errors (document was modified between read and write)
            case error instanceof MongooseError.VersionError:
                errorResponse = {
                    success: false,
                    message: 'Document conflict: document has been modified',
                    statusCode: 409
                };
                break;
            // Document not found
            case error.name === 'DocumentNotFoundError':
                errorResponse = {
                    success: false,
                    message: 'Document not found',
                    statusCode: 404
                };
                break;
            // Parallel save errors
            case error instanceof MongooseError.ParallelSaveError:
                errorResponse = {
                    success: false,
                    message: 'Document save conflict',
                    statusCode: 409
                };
                break;
            // // Default case for unhandled errors
            default:
                // Log unhandled errors for debugging
                console.error('Unhandled Mongoose Error:', error);
        }
        if (!errorResponse)
            return false;
        res.status(errorResponse.statusCode).json(errorResponse);
        return true;
    }
}
//# sourceMappingURL=mongooseErrorHandler.js.map