import { Response } from 'express';
import { watchlistService } from './service';

export const getWatchlists = async (req: any, res: Response) => {
  try {
    const watchlists = await watchlistService.getAllWatchlists(req.user.id);
    res.json(watchlists);
  } catch (error) {
    console.error('Get Watchlists Error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlists' });
  }
};

export const getWatchlist = async (req: any, res: Response) => {
  try {
    const watchlist = await watchlistService.getWatchlistById(
      req.params.id,
      req.user.id,
    );
    if (!watchlist) {
      return res.status(404).json({ error: 'Watchlist not found' });
    }
    res.json(watchlist);
  } catch (error) {
    console.error('Get Watchlist Error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

export const createWatchlist = async (req: any, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Watchlist name is required' });
    }

    const watchlist = await watchlistService.createWatchlist(req.user.id, {
      name,
    });
    res.status(201).json(watchlist);
  } catch (error: any) {
    console.error('Create Watchlist Error:', error);

    // Handle Prisma unique constraint error
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'A watchlist with this name already exists' });
    }

    res.status(500).json({
      error: 'Failed to create watchlist',
      details: error.message,
    });
  }
};

export const updateWatchlist = async (req: any, res: Response) => {
  try {
    const watchlist = await watchlistService.updateWatchlist(
      req.params.id,
      req.user.id,
      req.body,
    );
    res.json(watchlist);
  } catch (error) {
    console.error('Update Watchlist Error:', error);
    res.status(500).json({ error: 'Failed to update watchlist' });
  }
};

export const deleteWatchlist = async (req: any, res: Response) => {
  try {
    await watchlistService.deleteWatchlist(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    console.error('Delete Watchlist Error:', error);
    res.status(500).json({ error: 'Failed to delete watchlist' });
  }
};

export const addCompetitorToWatchlist = async (req: any, res: Response) => {
  try {
    const { watchlistId, competitorId } = req.body;
    await watchlistService.addCompetitorToWatchlist(
      watchlistId,
      competitorId,
      req.user.id,
    );
    res.status(204).send();
  } catch (error) {
    console.error('Add Competitor to Watchlist Error:', error);
    res.status(500).json({ error: 'Failed to add competitor to watchlist' });
  }
};

export const removeCompetitorFromWatchlist = async (
  req: any,
  res: Response,
) => {
  try {
    const { watchlistId, competitorId } = req.body;
    await watchlistService.removeCompetitorFromWatchlist(
      watchlistId,
      competitorId,
      req.user.id,
    );
    res.status(204).send();
  } catch (error) {
    console.error('Remove Competitor from Watchlist Error:', error);
    res
      .status(500)
      .json({ error: 'Failed to remove competitor from watchlist' });
  }
};
