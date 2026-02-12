import { Response } from 'express';
import { competitorsService } from './service';

export const getCompetitors = async (req: any, res: Response) => {
  try {
    const { watchlistId, includePosts } = req.query;
    const competitors = await competitorsService.getAllCompetitors(
      req.user.id,
      watchlistId as string,
      includePosts === 'true',
    );
    res.json(competitors);
  } catch (error) {
    console.error('Get Competitors Error:', error);
    res.status(500).json({ error: 'Failed to fetch competitors' });
  }
};

export const getCompetitor = async (req: any, res: Response) => {
  try {
    const competitor = await competitorsService.getCompetitorById(
      req.params.id,
      req.user.id,
    );
    if (!competitor) {
      return res.status(404).json({ error: 'Competitor not found' });
    }
    res.json(competitor);
  } catch (error) {
    console.error('Get Competitor Error:', error);
    res.status(500).json({ error: 'Failed to fetch competitor' });
  }
};

export const createCompetitor = async (req: any, res: Response) => {
  try {
    const {
      handle,
      name,
      avatarUrl,
      bio,
      tags,
      stats,
      socialAccountId,
      watchlistIds,
      platform,
      externalUrl,
    } = req.body;

    if (!handle || !name) {
      return res.status(400).json({ error: 'Handle and name are required' });
    }

    // Heuristics for manual creation if fields are missing
    const finalPlatform =
      platform || (handle.startsWith('@') ? 'youtube' : 'instagram');
    const finalExternalUrl =
      externalUrl ||
      (finalPlatform === 'tiktok'
        ? `https://www.tiktok.com/@${handle.replace('@', '')}`
        : finalPlatform === 'youtube'
          ? `https://www.youtube.com/${handle}/shorts`
          : `https://www.instagram.com/${handle.replace('@', '')}/`);

    const competitor = await competitorsService.createCompetitor(req.user.id, {
      handle: handle.replace('@', ''),
      name,
      avatarUrl,
      bio,
      tags,
      stats,
      socialAccountId,
      watchlistIds,
      platform: finalPlatform,
      externalUrl: finalExternalUrl,
    });
    res.status(201).json(competitor);
  } catch (error: any) {
    console.error('Create Competitor Error:', error);
    res
      .status(500)
      .json({ error: 'Failed to create competitor', details: error.message });
  }
};

export const bulkCreateCompetitors = async (req: any, res: Response) => {
  try {
    const { handles, tags, socialAccountId, watchlistId } = req.body;
    if (!handles || !Array.isArray(handles)) {
      return res.status(400).json({ error: 'Handles array is required' });
    }

    const competitors = await competitorsService.bulkCreateCompetitors(
      req.user.id,
      {
        handles,
        tags,
        socialAccountId,
        watchlistId,
      },
    );
    res.status(201).json(competitors);
  } catch (error: any) {
    console.error('Bulk Create Competitors Error:', error);
    res
      .status(500)
      .json({ error: 'Failed to create competitors', details: error.message });
  }
};

export const previewCompetitor = async (req: any, res: Response) => {
  try {
    const { handle } = req.query;
    if (!handle) {
      return res.status(400).json({ error: 'Handle is required' });
    }

    const preview = await competitorsService.previewCompetitor(
      handle as string,
    );
    res.json(preview);
  } catch (error: any) {
    console.error('Preview Competitor Error:', error);
    res
      .status(500)
      .json({ error: 'Failed to preview competitor', details: error.message });
  }
};

export const updateCompetitor = async (req: any, res: Response) => {
  try {
    const competitor = await competitorsService.updateCompetitor(
      req.params.id,
      req.user.id,
      req.body,
    );
    if (!competitor) {
      return res.status(404).json({ error: 'Competitor not found' });
    }
    res.json(competitor);
  } catch (error) {
    console.error('Update Competitor Error:', error);
    res.status(500).json({ error: 'Failed to update competitor' });
  }
};

export const deleteCompetitor = async (req: any, res: Response) => {
  try {
    const success = await competitorsService.deleteCompetitor(
      req.params.id,
      req.user.id,
    );
    if (!success) {
      return res.status(404).json({ error: 'Competitor not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Delete Competitor Error:', error);
    res.status(500).json({ error: 'Failed to delete competitor' });
  }
};

export const syncVideos = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    // If ID is provided, sync that competitor.
    // If we want to sync all, we might need a different route or check for special ID.
    // For now, let's assume this is per-competitor sync.

    const posts = await competitorsService.syncCompetitorVideos(
      id,
      req.user.id,
    );

    res.json({ success: true, count: posts.length, posts });
  } catch (error: any) {
    console.error('Sync Videos Error:', error);
    res
      .status(500)
      .json({ error: 'Failed to sync videos', details: error.message });
  }
};

export const syncAllCompetitors = async (req: any, res: Response) => {
  try {
    const posts = await competitorsService.syncAllCompetitors(req.user.id);
    res.json({ success: true, count: posts.length, posts });
  } catch (error: any) {
    console.error('Sync All Error:', error);
    res.status(500).json({
      error: 'Failed to sync all competitors',
      details: error.message,
    });
  }
};
