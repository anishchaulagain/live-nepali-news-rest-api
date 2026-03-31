import { Router } from 'express';
import { getLatestNews } from '../controllers/news.controller';
import { triggerScrape } from '../controllers/scrape.controller';

const router = Router();

/**
 * @openapi
 * /api/news/latest:
 *   get:
 *     summary: Retrieve the most recently scraped news article
 *     tags: [News]
 *     responses:
 *       200:
 *         description: The latest news article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     revampedTitle:
 *                       type: string
 *                     url:
 *                       type: string
 *                     source:
 *                       type: string
 *                     fetchedAt:
 *                       type: string
 *                       format: date-time
 *       404:
 *         description: No news articles found in the database
 *       500:
 *         description: Internal server error
 */
router.get('/latest', getLatestNews);

/**
 * @openapi
 * /api/news/scrape:
 *   post:
 *     summary: Manually trigger a news scrape (used by Vercel Cron)
 *     tags: [News]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: secret
 *         schema:
 *           type: string
 *         description: Cron secret for authentication
 *     responses:
 *       200:
 *         description: Scrape completed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/scrape', triggerScrape);
router.get('/scrape', triggerScrape); // Allow GET for easier Vercel Cron testing if needed

export default router;
