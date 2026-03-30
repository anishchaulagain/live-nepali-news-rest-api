import axios from 'axios';
import * as cheerio from 'cheerio';
import { News } from '../models/News';

export const scrapeLatestNews = async () => {
  try {
    const newsApiUrl = process.env.NEWS_API_URL || 'https://www.onlinekhabar.com/';
    const { data } = await axios.get(newsApiUrl);
    const $ = cheerio.load(data);

    // Precise selector based on OnlineKhabar.com structure
    // Target: <a> tag inside <h2> within <section class="ok-bises ok-bises-type-2">
    const titleLink = $('.ok-bises.ok-bises-type-2 h2 a').first();

    if (titleLink.length > 0) {
      const title = titleLink.text().trim();
      const url = titleLink.attr('href');

      if (title && url) {
        // Use the hostname as the source (e.g., onlinekhabar.com)
        const source = new URL(newsApiUrl).hostname;

        // Upsert the latest news record using its URL as the unique key
        const savedNews = await News.findOneAndUpdate(
          { url },
          { title, url, source, fetchedAt: new Date() },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`Successfully scraped and saved: ${title}`);
        return savedNews;
      }
    }
    
    console.warn(`Could not find the target news element at ${newsApiUrl}. The selectors might have changed.`);
    return null;
  } catch (error) {
    console.error(`Error scraping news: ${(error as Error).message}`);
    // As per user requirement: log error and retain last successful fetch.
    return null;
  }
};
