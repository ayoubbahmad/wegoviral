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

export const getVideo = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const video = await videosService.getVideoById(req.user.id, id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    console.error('Get Video Error:', error);
    res.status(500).json({ error: 'Failed to fetch video details' });
  }
};
