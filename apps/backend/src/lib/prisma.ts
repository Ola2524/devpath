import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

const isDev = process.env.NODE_ENV !== "production";

export const prisma = new PrismaClient({
  log: isDev
    ? [
        { emit: "event", level: "query" },
        { emit: "event", level: "error" },
        { emit: "event", level: "warn" },
      ]
    : [{ emit: "event", level: "error" }],
});

if (isDev) {
  prisma.$on("query", (e) => {
    logger.debug({ query: e.query, duration: `${e.duration}ms` }, "prisma query");
  });
}

prisma.$on("error", (e) => {
  logger.error({ err: e }, "prisma error");
});

prisma.$on("warn", (e) => {
  logger.warn({ warn: e }, "prisma warn");
});