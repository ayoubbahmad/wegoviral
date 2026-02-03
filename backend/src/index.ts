import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import hooksRoutes from './routes/hooks.routes';
import competitorsRoutes from './routes/competitors.routes';
import scriptsRoutes from './routes/scripts.routes';
import communityRoutes from './routes/community.routes';
import performanceRoutes from './routes/performance.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/hooks', hooksRoutes);
app.use('/api/competitors', competitorsRoutes);
app.use('/api/scripts', scriptsRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/performance', performanceRoutes);

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});
