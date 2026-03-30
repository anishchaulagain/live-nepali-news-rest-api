import { Request, Response } from 'express';
import { News } from '../models/News';

export const getLatestNews = async (req: Request, res: Response) => {
  try {
    // Fetch the most recently fetched news from DB
    const latestNews = await News.findOne().sort({ fetchedAt: -1 });

    if (!latestNews) {
      return res.status(404).json({
        success: false,
        message: 'No news found. The scraper might not have completed its initial run yet.',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        title: latestNews.title,
        url: latestNews.url,
        source: latestNews.source,
        fetchedAt: latestNews.fetchedAt
      }
    });

  } catch (error) {
    console.error(`Error retrieving latest news: ${(error as Error).message}`);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};
