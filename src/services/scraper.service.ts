import axios from 'axios';
import * as cheerio from 'cheerio';
import { News } from '../models/News';

export const scrapeLatestNews = async () => {
  try {
    const { data } = await axios.get('https://kantipurtv.com/');
    const $ = cheerio.load(data);

    // Using the exact selectors requested by the user
    // The target is the <a> tag inside the first article of the main news block
    const articleElem = $('.main-news-block .article-drop').first();
    const titleLink = articleElem.find('h1.fs-1 a.article-title.article-link');

    if (titleLink.length > 0) {
      const title = titleLink.text().trim();
      const url = titleLink.attr('href');

      if (title && url) {
        // Attempt to save to MongoDB
        // Using upsert or updating based on URL to prevent duplicates while updating 'fetchedAt' maybe
        // Wait, just storing the latest is fine. But wait, if they want history, a new record is fine.
        // Let's use updateOne with upsert to insert standard unique article based on URL
        const savedNews = await News.findOneAndUpdate(
          { url },
          { title, url, fetchedAt: new Date() },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        console.log(`Successfully scraped and saved: ${title}`);
        return savedNews;
      }
    }
    
    console.warn('Could not find the target news element on the page. Selectors might have changed.');
    return null;
  } catch (error) {
    console.error(`Error scraping news: ${(error as Error).message}`);
    // As per user requirement: log error and retain last successful fetch.
    return null;
  }
};
