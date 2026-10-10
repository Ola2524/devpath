import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { logger } from "../lib/logger.js";

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const requestId = randomUUID();
  const start = Date.now();

  res.setHeader("X-Request-Id", requestId);
  (req as Request & { requestId: string }).requestId = requestId;

  res.on("finish", () => {
    logger.info(
      {
        requestId,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${Date.now() - start}ms`,
      },
      "http request"
    );
  });

  next();
}