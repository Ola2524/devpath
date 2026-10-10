import type { Request, Response, NextFunction } from "express";
import { logger } from "../lib/logger.js";
import { AppError } from "../lib/AppError.js";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else if (isPrismaError(err)) {
    if (err.code === "P2002") {
      error = new AppError("Unique constraint violation", 409, "CONFLICT");
    } else if (err.code === "P2025") {
      error = new AppError("Record not found", 404, "NOT_FOUND");
    } else {
      error = new AppError("Database error", 500, "DB_ERROR");
      error.isOperational = false;
    }
  } else if (isZodError(err)) {
    error = new AppError("Validation failed", 400, "VALIDATION_ERROR", {
      issues: err.issues,
    });
  } else {
    error = new AppError(
      err instanceof Error ? err.message : "Internal server error",
      500,
      "INTERNAL_ERROR"
    );
    error.isOperational = false;
  }

  const logPayload = {
    err,
    method: req.method,
    url: req.originalUrl,
    statusCode: error.statusCode,
    code: error.code,
  };

  if (error.statusCode >= 500) {
    logger.error(logPayload, error.message);
  } else {
    logger.warn(logPayload, error.message);
  }

  const body: { error: { code: string; message: string; details?: unknown } } = {
    error: { code: error.code, message: error.message },
  };

  if (error.details) body.error.details = error.details;

  if (process.env.NODE_ENV === "production" && !error.isOperational) {
    body.error.message = "Internal server error";
  }

  res.status(error.statusCode).json(body);
}

function isPrismaError(
  err: unknown
): err is { code: string; meta?: { target?: string[] } } {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: unknown }).code === "string" &&
    (err as { code: string }).code.startsWith("P")
  );
}

function isZodError(err: unknown): err is { issues: unknown[] } {
  return (
    typeof err === "object" &&
    err !== null &&
    "issues" in err &&
    Array.isArray((err as { issues: unknown }).issues)
  );
}