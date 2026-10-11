import { prisma } from '../../lib/prisma';
import { SupabaseClaims } from '../../lib/supabase-auth';
import { AuthUser } from './model';

const USERNAME_PATTERN = /^[a-z0-9_]{3,30}$/;

const toUsernameBase = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 24)
    .padEnd(3, '0');

export class AuthService {
  // Supabase user id -> profile id, so most requests skip the database lookup
  private profileIdCache = new Map<string, string>();

  private formatUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      socialAccounts: user?.socialAccounts,
    };
  }

  isValidUsername(username: string) {
    return USERNAME_PATTERN.test(username);
  }

  async isUsernameAvailable(username: string) {
    const existing = await prisma.userProfile.findUnique({ where: { username } });
    return !existing;
  }

  private async generateUsername(preferred: string | undefined, email: string) {
    const base = toUsernameBase(preferred || email.split('@')[0]);
    if (await this.isUsernameAvailable(base)) return base;
    for (let attempt = 0; attempt < 10; attempt++) {
      const candidate = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
      if (await this.isUsernameAvailable(candidate)) return candidate;
    }
    return `${base}${Date.now().toString(36)}`;
  }

  /**
   * Finds the profile for a Supabase user, creating it on first login.
   * Existing profiles with the same verified email are linked instead of duplicated.
   */
  async resolveProfileId(claims: SupabaseClaims): Promise<string> {
    const cached = this.profileIdCache.get(claims.sub);
    if (cached) return cached;

    const profile =
      (await prisma.userProfile.findUnique({ where: { authUserId: claims.sub } })) ??
      (await this.linkOrCreateProfile(claims));

    this.profileIdCache.set(claims.sub, profile.id);
    return profile.id;
  }

  private async linkOrCreateProfile(claims: SupabaseClaims) {
    const email = claims.email?.toLowerCase();
    if (!email) throw new Error('Supabase user has no email');

    const metadata = claims.user_metadata ?? {};
    const existing = await prisma.userProfile.findUnique({ where: { email } });
    if (existing && !existing.authUserId && metadata.email_verified !== false) {
      return prisma.userProfile.update({
        where: { id: existing.id },
        data: { authUserId: claims.sub },
      });
    }

    const username = await this.generateUsername(metadata.username, email);
    const name = metadata.full_name || metadata.name || username;

    try {
      return await prisma.userProfile.create({
        data: {
          authUserId: claims.sub,
          email,
          username,
          name,
          avatarUrl: metadata.avatar_url || metadata.picture || null,
          // Placeholder account until real Instagram connection is built
          socialAccounts: {
            create: {
              platform: 'Instagram',
              username,
              accountId: `mock-${username}-IG`,
              isActive: true,
              isConnected: true,
            },
          },
        },
      });
    } catch (error: any) {
      // Two parallel first requests can race to create the same profile
      if (error?.code === 'P2002') {
        const profile = await prisma.userProfile.findUnique({
          where: { authUserId: claims.sub },
        });
        if (profile) return profile;
      }
      throw error;
    }
  }

  async getUserById(id: string) {
    const user = await prisma.userProfile.findUnique({
      where: { id },
      include: { socialAccounts: true },
    });

    if (!user) return null;
    return this.formatUser(user);
  }
}

export const authService = new AuthService();
