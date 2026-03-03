import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import logger from './lib/logger';

import hooksRoutes from './features/hooks/routes';
import competitorsRoutes from './features/competitors/routes';
import scriptsRoutes from './features/scripts/routes';
import scriptTemplatesRoutes from './features/script-templates/routes';
import communityRoutes from './features/community/routes';
import performanceRoutes from './features/performance/routes';
import authRoutes from './features/auth/routes';
import homeRoutes from './features/home/routes';
import automationRoutes from './features/automations/routes';
import socialAccountRoutes from './features/social-accounts/routes';
import libraryRoutes from './features/library/routes';
import watchlistsRoutes from './features/watchlists/routes';
import videosRoutes from './features/videos/routes';
import projectsRoutes from './features/projects/routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  }),
);

// app.use(morgan('dev')); // Removed morgan usage
app.use(pinoHttp({ logger })); // Use pino-http middleware

app.use(express.json());

// Routes
app.use('/api/hooks', hooksRoutes);
app.use('/api/competitors', competitorsRoutes);
app.use('/api/scripts', scriptsRoutes);
app.use('/api/script-templates', scriptTemplatesRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/automations', automationRoutes);
app.use('/api/social-accounts', socialAccountRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/watchlists', watchlistsRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/projects', projectsRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Backend server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err: any) => {
  logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
  logger.error({ err }, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err: any) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error({ err }, err.message);
  process.exit(1);
});
