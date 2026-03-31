import { Request, Response } from 'express';
import { scrapeLatestNews } from '../services/scraper.service';
import { env } from '../config/env';
import logger from '../config/logger';

export const triggerScrape = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const cronSecret = req.query.secret || (authHeader && authHeader.split(' ')[1]);

    if (cronSecret !== env.CRON_SECRET) {
      logger.warn(`Unauthorized scrape attempt from IP: ${req.ip}`);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    logger.info('Triggering manual/cron scrape...');
    const result = await scrapeLatestNews();

    if (!result) {
      return res.status(204).json({ success: true, message: 'No new news found' });
    }

    res.status(200).json({
      success: true,
      message: 'Scrape completed successfully',
      data: result,
    });
  } catch (error) {
    logger.error(`Error in triggerScrape controller: ${(error as Error).message}`);
    res.status(500).json({ success: false, message: 'Internal server error during scraping' });
  }
};
