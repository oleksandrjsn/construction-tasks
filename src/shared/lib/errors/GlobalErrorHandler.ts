import {
  AppError,
  ConflictError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "./AppError";

interface ErrorInterceptor {
  onError: (error: AppError) => void;
}

class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private interceptors: ErrorInterceptor[] = [];

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  addInterceptor(interceptor: ErrorInterceptor) {
    this.interceptors.push(interceptor);
  }

  removeInterceptor(interceptor: ErrorInterceptor) {
    const index = this.interceptors.indexOf(interceptor);
    if (index > -1) {
      this.interceptors.splice(index, 1);
    }
  }

  handleError(error: unknown): AppError {
    let appError: AppError;

    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof Error) {
      appError = this.mapErrorToAppError(error);
    } else if (typeof error === "string") {
      appError = new AppError(error);
    } else {
      appError = new AppError(
        "An unknown error occurred",
        "UNKNOWN_ERROR",
        500,
        false
      );
    }

    this.interceptors.forEach((interceptor) => {
      try {
        interceptor.onError(appError);
      } catch (e) {
        console.error("Error in error interceptor:", e);
      }
    });

    return appError;
  }

  private mapErrorToAppError(error: Error): AppError {
    if (error.message.includes("not found")) {
      return new NotFoundError(error.message);
    }

    if (error.message.includes("already exists")) {
      return new ConflictError(error.message);
    }

    if (
      error.message.includes("required") ||
      error.message.includes("invalid")
    ) {
      return new ValidationError(error.message);
    }

    if (
      error.message.includes("database") ||
      error.message.includes("connection")
    ) {
      return new DatabaseError(error.message, error);
    }

    return new AppError(error.message, "UNKNOWN_ERROR", 500, false);
  }

  async wrapAsync<T>(asyncFn: () => Promise<T>): Promise<T> {
    try {
      return await asyncFn();
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();
