import { config } from '@/config';
import { logger } from '@/shared/utils/logger';
import { prisma } from '@/shared/utils/prisma';
import app from './app';

const PORT = config.PORT;

app.listen(PORT, async () => {
  await prisma.$connect();
  logger.info({ port: PORT }, 'Server started');
});
