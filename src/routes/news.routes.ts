import { Router } from 'express';
import { getLatestNews } from '../controllers/news.controller';

const router = Router();

// GET /api/news/latest
router.get('/latest', getLatestNews);

export default router;
