import { env } from 'node:process';
import { defineConfig } from 'prisma/config';
import { config } from 'dotenv';

config();

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url:
      env.DATABASE_URL ??
      (() => {
        throw new Error('DATABASE_URL is not set');
      })(),
  },
});
