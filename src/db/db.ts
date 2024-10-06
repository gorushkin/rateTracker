import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { config } from '../config';

export const client = new Database(config.DB_URL);
export const db = drizzle(client, { schema });
