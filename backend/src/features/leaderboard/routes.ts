import { Response, Router } from 'express';
import { z } from 'zod';
import { protect } from '../../middleware/auth.middleware';
import { getHowItWorks, getLeaderboard } from './service';

const PeriodSchema = z.object({ period: z.enum(['7d', '30d', 'all']).default('7d') });

const router = Router();
router.use(protect);

router.get('/', async (req: any, res: Response) => {
  try {
    const { period } = PeriodSchema.parse(req.query);
    res.json(await getLeaderboard(req.user.id, period));
  } catch (error) {
    req.log?.error({ err: error }, 'load leaderboard failed');
    res.status(error instanceof z.ZodError ? 400 : 500).json({ error: 'Failed to load the leaderboard' });
  }
});

router.get('/how-it-works', async (req: any, res: Response) => {
  try {
    res.json(await getHowItWorks());
  } catch (error) {
    req.log?.error({ err: error }, 'load points explainer failed');
    res.status(500).json({ error: 'Failed to load how points work' });
  }
});

export default router;
