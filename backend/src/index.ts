import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import hooksRoutes from './routes/hooks.routes';
import competitorsRoutes from './routes/competitors.routes';
import scriptsRoutes from './routes/scripts.routes';
import communityRoutes from './routes/community.routes';
import performanceRoutes from './routes/performance.routes';
import authRoutes from './routes/auth.routes';

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
