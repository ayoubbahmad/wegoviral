/**
 * Helpers for the API test suite. Tests talk to a running backend over HTTP
 * (API_URL, default http://localhost:3001/api) with real Supabase users, and
 * delete everything they create afterwards.
 */
import { PrismaClient, UserRole } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const env = (key: string) => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} must be set to run the API tests`);
  return value;
};

export const API_URL = process.env.API_URL || 'http://localhost:3001/api';
const SUPABASE_URL = env('SUPABASE_URL');
const SUPABASE_PUBLISHABLE_KEY = env('SUPABASE_PUBLISHABLE_KEY');

export const prisma = new PrismaClient();
export const supabaseAdmin = createClient(SUPABASE_URL, env('SUPABASE_SECRET_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Test accounts use this domain so leftovers are easy to spot and remove
export const TEST_EMAIL_DOMAIN = 'apitest.wegoviral.test';

const created = { authUserIds: [] as string[], storagePaths: [] as string[] };

export interface ApiResponse<T = any> {
  status: number;
  data: T;
}

export interface TestUser {
  email: string;
  profileId: string;
  authUserId: string;
  role: UserRole;
  call: <T = any>(method: string, path: string, body?: unknown) => Promise<ApiResponse<T>>;
}

export async function callApi<T = any>(
  method: string,
  path: string,
  { token, body }: { token?: string; body?: unknown } = {},
): Promise<ApiResponse<T>> {
  const response = await fetch(API_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data: any = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // keep raw text
  }
  return { status: response.status, data };
}

/** Creates a confirmed Supabase user, signs in, and loads its profile through the API. */
export async function createTestUser(
  tag: string,
  {
    role,
    joined = true,
    probation = false,
  }: {
    role?: UserRole;
    /** true: already approved and up to date with the guide/quiz, like an existing member */
    joined?: boolean;
    /** true: a new member whose first posts still go through review */
    probation?: boolean;
  } = {},
): Promise<TestUser> {
  const unique = `${tag}${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `${unique}@${TEST_EMAIL_DOMAIN}`;
  const password = `Test-${unique}-pass`;

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: `Test ${tag}`, username: `t_${tag}` },
  });
  if (error || !data.user) throw new Error(`Could not create test user: ${error?.message}`);
  created.authUserIds.push(data.user.id);

  const session = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then((response) => response.json());
  const token: string = session.access_token;

  const me = await callApi('GET', '/auth/me', { token });
  if (me.status !== 200) throw new Error(`/auth/me failed for test user: ${me.status}`);
  let profileRole: UserRole = me.data.user.role;

  if (role && role !== profileRole) {
    await prisma.userProfile.update({ where: { id: me.data.user.id }, data: { role } });
    profileRole = role;
  }
  if (joined) {
    const settings = await prisma.communitySettings.findUnique({ where: { id: 'default' } });
    const version = settings?.guideVersion ?? 0;
    await prisma.userProfile.update({
      where: { id: me.data.user.id },
      data: {
        joinStatus: 'APPROVED',
        rulesAcceptedVersion: version,
        quizPassedVersion: version,
        probationCompletedAt: probation ? null : new Date(),
      },
    });
  }

  return {
    email,
    profileId: me.data.user.id,
    authUserId: data.user.id,
    role: profileRole,
    call: (method, path, body) => callApi(method, path, { token, body }),
  };
}

export function trackStorageFile(path: string) {
  created.storagePaths.push(path);
}

/** Removes every test user, their profiles (cascading to their content) and uploaded files. */
export async function cleanupTestData() {
  const testProfiles = await prisma.userProfile.findMany({
    where: { email: { endsWith: `@${TEST_EMAIL_DOMAIN}` } },
    select: { id: true },
  });
  const ids = testProfiles.map((profile) => profile.id);
  // Activity entries by or about test users (post/comment entries are by a test actor)
  await prisma.adminActivity.deleteMany({
    where: { OR: [{ actorId: { in: ids } }, { targetId: { in: ids } }] },
  });
  // Invite links made by test users (applications using them cascade with the profiles)
  await prisma.memberApplication.deleteMany({ where: { userId: { in: ids } } });
  await prisma.inviteLink.deleteMany({ where: { createdById: { in: ids } } });
  await prisma.userProfile.deleteMany({ where: { id: { in: ids } } });
  // Also catches logins left behind by an interrupted earlier run
  const { data } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
  const leftovers = data.users.filter((user) => user.email?.endsWith(`@${TEST_EMAIL_DOMAIN}`)).map((user) => user.id);
  for (const id of new Set([...created.authUserIds.splice(0), ...leftovers])) {
    await supabaseAdmin.auth.admin.deleteUser(id);
  }
  const paths = created.storagePaths.splice(0);
  if (paths.length) await supabaseAdmin.storage.from('community').remove(paths);
  await prisma.$disconnect();
}

/** A 1×1 PNG for upload tests. */
export const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

export const STORAGE_UPLOAD_URL = (path: string, token: string) =>
  `${SUPABASE_URL}/storage/v1/object/upload/sign/community/${path}?token=${token}`;
