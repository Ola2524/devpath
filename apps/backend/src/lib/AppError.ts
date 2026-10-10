export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details: unknown;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_ERROR",
    details: unknown = null
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const BadRequest = (message: string, code?: string, details?: unknown): AppError =>
  new AppError(message, 400, code ?? "BAD_REQUEST", details);

export const Unauthorized = (message = "Unauthorized"): AppError =>
  new AppError(message, 401, "UNAUTHORIZED");

export const Forbidden = (message = "Forbidden"): AppError =>
  new AppError(message, 403, "FORBIDDEN");

export const NotFound = (message = "Not found"): AppError =>
  new AppError(message, 404, "NOT_FOUND");

export const Conflict = (message: string, code?: string): AppError =>
  new AppError(message, 409, code ?? "CONFLICT");

export const Internal = (message = "Internal server error"): AppError =>
  new AppError(message, 500, "INTERNAL_ERROR");