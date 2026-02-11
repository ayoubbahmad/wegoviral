import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import { AuthUser } from './model';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export class AuthService {
  private signToken(id: string) {
    return jwt.sign({ id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
    });
  }

  private formatUser(user: any): AuthUser {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      socialAccounts: user?.socialAccounts,
    };
  }

  async registerUser(data: {
    email: string;
    password: string;
    username: string;
    name?: string;
  }) {
    const passwordHash = await bcrypt.hash(data.password, 12);

    const user = await prisma.userProfile.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        name: data.name || data.username,
        socialAccounts: {
          create: {
            platform: 'Instagram',
            username: data.username,
            accountId: `mock-${data.username}-IG`,
            isActive: true,
            isConnected: true,
          },
        },
      },
      include: {
        socialAccounts: true,
      },
    });

    const token = this.signToken(user.id);
    return { token, user: this.formatUser(user) };
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.userProfile.findUnique({
      where: { email },
      include: { socialAccounts: true },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return null;
    }

    const token = this.signToken(user.id);
    return { token, user: this.formatUser(user) };
  }

  async getUserById(id: string) {
    const user = await prisma.userProfile.findUnique({
      where: { id },
      include: { socialAccounts: true },
    });

    if (!user) return null;
    return this.formatUser(user);
  }

  async isEmailOrUsernameTaken(email: string, username: string) {
    const existingUser = await prisma.userProfile.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    return !!existingUser;
  }
}

export const authService = new AuthService();
