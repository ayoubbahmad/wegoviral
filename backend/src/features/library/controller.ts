import { Request, Response } from 'express';
import { scrapeUrl } from '../../lib/scraper';

export const getMetadata = async (req: Request, res: Response) => {
  const { url } = req.query;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const metadata = await scrapeUrl(url);
    res.json(metadata);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
