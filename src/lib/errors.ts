export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      name: this.name,
    };
  }

  static fromJSON(json: {
    message: string;
    code: string;
    statusCode: number;
    name: string;
  }): AppError {
    const error = new AppError(json.message, json.code, json.statusCode);
    error.name = json.name;
    return error;
  }
}

export const ErrorCodes = {
  USER_EXISTS: "USER_EXISTS",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;
