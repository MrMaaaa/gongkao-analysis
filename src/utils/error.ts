type CommonError = {
  message: string;
};

export default class ErrorUtils {
  private static isCommonError(error: unknown): error is CommonError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    );
  }

  public static getErrorMessage(error: unknown): string {
    return this.convertToCommonError(error).message;
  }

  private static convertToCommonError(error: unknown): CommonError {
    if (this.isCommonError(error)) {
      return error;
    }
    try {
      return new Error(JSON.stringify(error));
    } catch (error) {
      // 如果抛出的异常不是object
      return new Error(String(error));
    }
  }
}
