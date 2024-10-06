type ErrorType =
  | 'ValidationError'
  | 'DatabaseError'
  | 'AuthenticationError'
  | 'AuthorizationError'
  | 'NotFoundError'
  | 'APIError'
  | 'InternalError';

class AppError extends Error {
  type: ErrorType = 'InternalError';

  constructor(message: string) {
    super(message);
  }
}

class ValidationError extends AppError {
  type: ErrorType = 'ValidationError';
  constructor(message: string) {
    super(message);
  }
}

class ApiError extends AppError {
  type: ErrorType = 'APIError';
  constructor(message: string) {
    super(message);
  }
}

const errorHandler = async (func: Promise<void>) => {
  try {
    await func;
  } catch (error) {
    if (!(error instanceof AppError)) {
      throw error;
    }

    // TODO: Add logging
  }
};

export { AppError, errorHandler, ValidationError, ApiError };
