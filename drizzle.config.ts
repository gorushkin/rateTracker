import { defineConfig } from 'drizzle-kit';
import { config } from './src/config';

if (!config.DB_URL) {
  throw new Error('DB_URL is not defined');
}

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  verbose: true,
  strict: true,
  dbCredentials: {
    url: config.DB_URL,
  },
});
