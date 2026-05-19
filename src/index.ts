import { config } from '@/config';
import { logger } from '@/shared/utils/logger';
import { prisma } from '@/shared/utils/prisma';
import app from './app';

const PORT = config.PORT;

const server = app.listen(PORT, async () => {
  await prisma.$connect();
  logger.info({ port: PORT }, 'Server started');
});

const shutdown = async (signal: string) => {
  logger.info({ signal }, 'Shutdown signal received');

  const forceExit = setTimeout(() => {
    logger.warn('Forcing shutdown due to timeout');
    process.exit(1);
  }, 10000);

  forceExit.unref();

  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Server closed, exiting process');
    clearTimeout(forceExit);
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
