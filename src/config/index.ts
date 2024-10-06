import * as dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_API = process.env.TELEGRAM_API ?? '';
const DB_URL = process.env.DB_URL;

export const DEFAULT_TIMEZONE_OFFSET = 0;

export const config = { TELEGRAM_API, DB_URL };
