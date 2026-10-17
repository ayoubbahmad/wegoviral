import { z } from 'zod';

export const ROLE_VALUES = ['MEMBER', 'INSTRUCTOR', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'] as const;
export const STATUS_VALUES = ['ACTIVE', 'MUTED', 'SUSPENDED', 'BANNED'] as const;

export const ListMembersQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  role: z.enum(ROLE_VALUES).optional(),
  status: z.enum(STATUS_VALUES).optional(),
  sort: z.enum(['newest', 'oldest', 'name']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const ChangeRoleSchema = z.object({ role: z.enum(ROLE_VALUES) });

export const RestrictMemberSchema = z.object({
  status: z.enum(['MUTED', 'SUSPENDED', 'BANNED']),
  reason: z.string().trim().min(3, 'Give a short reason').max(500),
  /** null = until lifted by staff */
  durationDays: z.number().int().min(1).max(365).nullable(),
});

export const ListActivityQuerySchema = z.object({
  targetType: z.enum(['member', 'post', 'comment', 'space']).optional(),
  targetId: z.string().optional(),
  actorId: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export type ListMembersQuery = z.infer<typeof ListMembersQuerySchema>;
export type RestrictMemberInput = z.infer<typeof RestrictMemberSchema>;
export type ListActivityQuery = z.infer<typeof ListActivityQuerySchema>;

export class AdminError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
