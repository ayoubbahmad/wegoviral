import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const signToken = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN as any,
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, username, name } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ error: 'Please provide email, password and username' });
        }

        // Check if user exists
        const existingUser = await prisma.userProfile.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.userProfile.create({
            data: {
                email,
                username,
                passwordHash,
                name: name || username,
                socialAccounts: {
                    create: {
                        platform: 'Instagram',
                        username: username,
                        accountId: `mock-${username}-IG`,
                        isActive: true,
                        isConnected: true
                    }
                }
            },
            include: {
                socialAccounts: true
            }
        });

        const token = signToken(user.id);

        res.status(201).json({
            status: 'success',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                socialAccounts: user.socialAccounts
            }
        });
    } catch (error: any) {
        console.error('Register detailed error:', {
            message: error.message,
            stack: error.stack,
            code: error.code, // Prisma error codes
            meta: error.meta
        });
        res.status(500).json({
            error: 'Failed to register user',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide email and password' });
        }

        const user = await prisma.userProfile.findUnique({
            where: { email },
            include: { socialAccounts: true }
        });

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        const token = signToken(user.id);

        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                socialAccounts: user.socialAccounts
            }
        });
    } catch (error: any) {
        console.error('Login detailed error:', {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        res.status(500).json({
            error: 'Failed to login',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getMe = async (req: any, res: Response) => {
    try {
        const user = await prisma.userProfile.findUnique({
            where: { id: req.user.id },
            include: { socialAccounts: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'User no longer exists' });
        }

        res.status(200).json({
            status: 'success',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                name: user.name,
                avatarUrl: user.avatarUrl,
                socialAccounts: user.socialAccounts
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user details' });
    }
};
