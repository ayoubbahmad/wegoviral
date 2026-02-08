import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import hooksRoutes from './features/hooks/routes';
import competitorsRoutes from './features/competitors/routes';
import scriptsRoutes from './features/scripts/routes';
import communityRoutes from './features/community/routes';
import performanceRoutes from './features/performance/routes';
import authRoutes from './features/auth/routes';
import homeRoutes from './features/home/routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/hooks', hooksRoutes);
app.use('/api/competitors', competitorsRoutes);
app.use('/api/scripts', scriptsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', (err: any) => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    server.close(() => {
        process.exit(1);
    });
});

process.on('uncaughtException', (err: any) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message, err.stack);
    process.exit(1);
});
