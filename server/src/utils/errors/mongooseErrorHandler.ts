import {Response} from 'express';
import {Error as MongooseError} from 'mongoose';
import {MongoError} from 'mongodb';

interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: string[];
  statusCode: number;
}

export class MongooseErrorHandler {
  private static handleValidationError(error: MongooseError.ValidationError): ErrorResponse {
    const errors = Object.values(error.errors).map(err => err.message);
    return {
      success: false,
      message: 'Validation error',
      errors,
      statusCode: 400
    };
  }

  private static handleCastError(error: MongooseError.CastError): ErrorResponse {
    return {
      success: false,
      message: `Invalid ${error.path}: ${error.value}`,
      statusCode: 400
    };
  }

  private static handleDuplicateKeyError(error: any): ErrorResponse {
    // The error object from MongoDB doesn't have proper TypeScript types for these properties
    const keyValue = (error as any).keyValue;
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];

    return {
      success: false,
      message: `Duplicate value: ${value} for field: ${field}`,
      statusCode: 409
    };
  }

  public static handle(error: any, res: Response): Boolean {
    let errorResponse: ErrorResponse | null = null;

    switch (true) {
        // Validation errors (missing required fields, invalid formats, etc.)
      case error instanceof MongooseError.ValidationError:
        errorResponse = this.handleValidationError(error as MongooseError.ValidationError);
        break;

        // Cast errors (invalid ObjectId, wrong data type, etc.)
      case error instanceof MongooseError.CastError:
        errorResponse = this.handleCastError(error as MongooseError.CastError);
        break;

        // Duplicate key errors (unique constraint violations)
      case error.code === 11000:
        errorResponse = this.handleDuplicateKeyError(error as MongoError);
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
    return true
  }
}