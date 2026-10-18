import { Response } from 'express';
import { ZodError } from 'zod';
import * as eventsService from './service';
import { setAccessRule } from '../admin/access.service';
import { AccessRuleSchema, AdminError } from '../admin/model';
import { CreateEventSchema, EventError, ListEventsQuerySchema, UpdateEventSchema } from './model';

const handle =
  (action: string, fn: (req: any, res: Response) => Promise<unknown>) =>
  async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request' });
      }
      if (error instanceof EventError || error instanceof AdminError) {
        return res.status(error.status).json({ error: error.message });
      }
      req.log?.error({ err: error }, `${action} failed`);
      res.status(500).json({ error: `Failed to ${action}` });
    }
  };

const csvCell = (value: unknown) => {
  const text = value instanceof Date ? value.toISOString() : String(value ?? '');
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const listEvents = handle('load events', async (req, res) => {
  res.json(await eventsService.listEvents(req.user, ListEventsQuerySchema.parse(req.query)));
});

export const listCategories = handle('load categories', async (_req, res) => {
  res.json(await eventsService.listCategories());
});

export const getEvent = handle('load event', async (req, res) => {
  res.json(await eventsService.getEvent(req.user, req.params.id));
});

export const createEvent = handle('create event', async (req, res) => {
  res.status(201).json(await eventsService.createEvent(req.user, CreateEventSchema.parse(req.body)));
});

export const updateEvent = handle('update event', async (req, res) => {
  res.json(await eventsService.updateEvent(req.user, req.params.id, UpdateEventSchema.parse(req.body)));
});

export const deleteEvent = handle('delete event', async (req, res) => {
  await eventsService.deleteEvent(req.user, req.params.id);
  res.status(204).end();
});

export const going = handle('save RSVP', async (req, res) => {
  res.json(await eventsService.setGoing(req.user, req.params.id, true));
});

export const notGoing = handle('cancel RSVP', async (req, res) => {
  res.json(await eventsService.setGoing(req.user, req.params.id, false));
});

export const listAttendees = handle('load attendees', async (req, res) => {
  const result = await eventsService.listAttendees(req.user, req.params.id);
  if (req.query.format !== 'csv') return res.json(result);
  const rows = [
    ['Name', 'Username', 'Email', 'RSVP date'],
    ...result.attendees.map((a) => [a.name ?? '', `@${a.username}`, a.email, a.rsvpAt]),
  ];
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="attendees-${result.event.id}.csv"`);
  res.send(rows.map((row) => row.map(csvCell).join(',')).join('\n'));
});

export const getAccess = handle('load access rule', async (req, res) => {
  res.json(await eventsService.getEventAccess(req.user, req.params.id));
});

export const setAccess = handle('save access rule', async (req, res) => {
  await eventsService.assertCanManage(req.user, req.params.id);
  res.json(await setAccessRule(req.user, 'event', req.params.id, AccessRuleSchema.parse(req.body)));
});
