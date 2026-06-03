import app from './app';
import { env } from './config/env';
import { prisma } from './config/db';
import { logger } from './config/logger';

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.success('Database connection established successfully via Prisma');

    const port = env.PORT || 8000;
    app.listen(port, () => {
      logger.success(`[Server] running on port ${port} in ${env.NODE_ENV} mode`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
