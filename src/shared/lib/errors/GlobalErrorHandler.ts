interface ErrorInterceptor {
  onError: (error: Error) => void;
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

  handleError(error: unknown): Error {
    let preparedError: Error;

    if (error instanceof Error) {
      preparedError = error;
    } else {
      preparedError = new Error("Unknown error occurred");
    }

    this.interceptors.forEach((interceptor) => {
      try {
        interceptor.onError(preparedError);
      } catch (e) {
        console.error("Error in error interceptor:", e);
      }
    });

    console.debug("Error handled by interceptors:", preparedError.message);
    return preparedError;
  }

  async wrapAsync<T>(asyncFn: () => Promise<T>): Promise<T> {
    try {
      return await asyncFn();
    } catch (error) {
      this.handleError(error);
      return undefined as T;
    }
  }

  wrapSync<T>(syncFn: () => T): T {
    try {
      return syncFn();
    } catch (error) {
      this.handleError(error);
      return undefined as T;
    }
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();
