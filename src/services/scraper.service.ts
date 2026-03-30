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

        // Check if the news is the same as the last scraped item
        const latestEntry = await News.findOne().sort({ fetchedAt: -1 });

        if (latestEntry && latestEntry.url === url && latestEntry.title === title) {
          console.log(`News already up to date: ${title}`);
          return latestEntry;
        }

        // Upsert the news record (update fetchedAt if url is the same but something else changed, 
        // normally this handles updates if needed while preventing duplicates)
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
