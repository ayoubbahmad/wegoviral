import { Response } from 'express';
import { ZodError } from 'zod';
import * as helpService from './service';
import { CreateArticleSchema, HelpError, HelpQuerySchema, ReorderArticlesSchema, UpdateArticleSchema } from './model';

const handle =
  (action: string, fn: (req: any, res: Response) => Promise<unknown>) =>
  async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request' });
      }
      if (error instanceof HelpError) return res.status(error.status).json({ error: error.message });
      req.log?.error({ err: error }, `${action} failed`);
      res.status(500).json({ error: `Failed to ${action}` });
    }
  };

export const listArticles = handle('load help articles', async (req, res) => {
  const { space, q } = HelpQuerySchema.parse(req.query);
  res.json(await helpService.listArticles(req.user, space, q));
});

export const getArticle = handle('load help article', async (req, res) => {
  res.json(await helpService.getArticle(req.user, req.params.slug));
});

export const listAllArticles = handle('load help articles', async (req, res) => {
  const { space } = HelpQuerySchema.parse(req.query);
  res.json(await helpService.listAllArticles(req.user, space));
});

export const createArticle = handle('create help article', async (req, res) => {
  res.status(201).json(await helpService.createArticle(req.user, CreateArticleSchema.parse(req.body)));
});

export const updateArticle = handle('update help article', async (req, res) => {
  res.json(await helpService.updateArticle(req.user, req.params.id, UpdateArticleSchema.parse(req.body)));
});

export const deleteArticle = handle('delete help article', async (req, res) => {
  await helpService.deleteArticle(req.user, req.params.id);
  res.status(204).end();
});

export const reorderArticles = handle('reorder help articles', async (req, res) => {
  await helpService.reorderArticles(req.user, ReorderArticlesSchema.parse(req.body).ids);
  res.status(204).end();
});
