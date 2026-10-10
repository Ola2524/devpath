import "dotenv/config";
import { createApp } from "./app.js";
import { logger } from "./lib/logger.js";
import { prisma } from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 8000;

async function startServer(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info("Database connected");

    const app = createApp();
    const server = app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });

    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`${signal} received, shutting down gracefully`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info("Shutdown complete");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => void shutdown("SIGTERM"));
    process.on("SIGINT", () => void shutdown("SIGINT"));
  } catch (error) {
    logger.error({ err: error }, "Failed to start server");
    process.exit(1);
  }
}

void startServer();