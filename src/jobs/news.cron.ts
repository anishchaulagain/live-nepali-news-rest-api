import cron from 'node-cron';
import { scrapeLatestNews } from '../services/scraper.service';
import dotenv from 'dotenv';
dotenv.config();

const interval = process.env.SCRAPE_INTERVAL || 10;
const cronExpression = `*/${interval} * * * *`;

export const startNewsCron = () => {
  // Run on startup
  console.log('Running initial scrape...');
  scrapeLatestNews();

  // Schedule the task
  cron.schedule(cronExpression, async () => {
    console.log(`Running scheduled scraping job based on cron: ${cronExpression}`);
    await scrapeLatestNews();
  });
  
  console.log(`Scheduled news cron job every ${interval} minutes.`);
};
