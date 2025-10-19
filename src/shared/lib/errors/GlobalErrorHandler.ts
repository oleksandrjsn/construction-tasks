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

    return preparedError;
  }
}

export const globalErrorHandler = GlobalErrorHandler.getInstance();
