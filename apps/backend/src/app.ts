import express, { type Express } from "express";
import cors from "cors";
import { logger } from "./lib/logger.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "1mb" }));
  app.use(requestLogger);

  app.get("/", (_req, res) => {
    res.json({ message: "API is running" });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}