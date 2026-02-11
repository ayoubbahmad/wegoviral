import { Response } from 'express';
import { videosService } from './service';

export const getVideos = async (req: any, res: Response) => {
  try {
    const { watchlistId, limit } = req.query;
    const videos = await videosService.getAllVideos(
      req.user.id,
      watchlistId as string,
      limit ? parseInt(limit as string) : 50,
    );
    res.json(videos);
  } catch (error) {
    console.error('Get Videos Error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};
