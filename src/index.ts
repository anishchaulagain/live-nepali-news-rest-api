import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import 'express-async-errors';

import { env } from './config/env';
import { connectDB } from './config/db';
import { startNewsCron } from './jobs/news.cron';
import newsRoutes from './routes/news.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocs } from './config/swagger';
import { errorHandler } from './middleware/error.middleware';
import { limiter } from './middleware/rate-limiter.middleware';
import logger from './config/logger';

// Load env vars validation happens in env.ts
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS
app.use(compression()); // Compress responses
app.use(express.json()); // Body parser

// Request logging
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined', {
  stream: { write: (message: string) => logger.info(message.trim()) }
}));

// Rate limiting
app.use('/api', limiter);

// Routes
app.use('/api/news', newsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Health check endpoint
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', environment: env.NODE_ENV }));

// Global error handler
app.use(errorHandler);

// Execution Logic (Vercel adaptation)
if (env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
  const PORT = env.PORT || 3000;
  app.listen(PORT, () => {
    logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    
    // Start local cron job only if NOT on Vercel
    if (process.env.VERCEL !== '1') {
      startNewsCron();
    }
  });
}

// Export for Vercel
export default app;
