import * as dotenv from 'dotenv';

dotenv.config();

console.log(process.env);

const TELEGRAM_API = process.env.TELEGRAM_API ?? '';

export const config = { TELEGRAM_API };
