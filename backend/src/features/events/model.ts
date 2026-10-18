import { z } from 'zod';

const optionalUrl = z.string().trim().url('Enter a full link, starting with https://').max(500).optional().nullable().or(z.literal('').transform(() => null));

const isValidTimezone = (zone: string) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: zone });
    return true;
  } catch {
    return false;
  }
};

// No defaults here: they would also fill in fields missing from a partial update
const EventFields = z.object({
  title: z.string().trim().min(3, 'Give the event a title').max(120),
  description: z.string().trim().max(5000),
  coverUrl: optionalUrl,
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  timezone: z.string().refine(isValidTimezone, 'Unknown time zone'),
  locationType: z.enum(['ONLINE', 'IN_PERSON']),
  location: z.string().trim().max(200).optional().nullable(),
  link: optionalUrl,
  // Empty text clears the category; a missing field leaves it as it is
  category: z.string().trim().max(40).nullable().optional().transform((value) => (value === '' ? null : value)),
  capacity: z.number().int().min(1).max(100000).nullable().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'CANCELLED']),
  recordingUrl: optionalUrl,
});

export const CreateEventSchema = EventFields.extend({
  description: EventFields.shape.description.default(''),
  locationType: EventFields.shape.locationType.default('ONLINE'),
  status: EventFields.shape.status.default('DRAFT'),
}).refine((event) => event.endsAt > event.startsAt, {
  message: 'The event must end after it starts',
  path: ['endsAt'],
});

export const UpdateEventSchema = EventFields.partial();

export const ListEventsQuerySchema = z.object({
  scope: z.enum(['upcoming', 'past', 'range']).default('upcoming'),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  category: z.string().trim().max(40).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type ListEventsQuery = z.infer<typeof ListEventsQuerySchema>;

export class EventError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
