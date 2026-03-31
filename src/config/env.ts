import { cleanEnv, str, port, url, num } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'], default: 'development' }),
  PORT: port({ default: 3000 }),
  MONGODB_URI: str(),
  NEWS_API_URL: url({ default: 'https://www.onlinekhabar.com/' }),
  SCRAPE_INTERVAL: num({ default: 10 }),
  GROQ_API_KEY: str(),
  GROQ_MODEL: str({ default: 'llama-3.3-70b-versatile' }),
  CRON_SECRET: str({ desc: 'Secret for authenticating cron job calls' }),
});
