import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '@/config';
import { PrismaClient } from '@/generated/prisma/client';

const prismaClientSingleton = () => {
  const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: ReturnType<typeof prismaClientSingleton> | undefined;
}

export const prisma = global.prismaGlobal ?? prismaClientSingleton();

if (config.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}
