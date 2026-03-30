import { Router } from 'express';
import { getLatestNews } from '../controllers/news.controller';

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

export default router;
