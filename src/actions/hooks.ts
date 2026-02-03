'use server';

import { prisma } from '@/lib/prisma';
import { Hook } from '@/types/library';
import { revalidatePath } from 'next/cache';

// Mock user ID for now (will be replaced with Clerk user ID)
const MOCK_USER_ID = 'mock-user-1';

export async function createHook(data: Omit<Hook, 'id' | 'addedAt'>) {
    try {
        // For now, we'll create a default user if it doesn't exist
        await ensureUserExists();

        const hook = await prisma.hook.create({
            data: {
                content: data.content,
                type: data.type,
                emotion: data.emotion,
                topic: data.topic,
                performanceRating: data.performanceRating,
                usageCount: data.usageCount || 0,
                lastUsed: data.lastUsed ? new Date(data.lastUsed) : null,
                userId: MOCK_USER_ID,
            },
        });

        revalidatePath('/library');
        return { success: true, hook };
    } catch (error) {
        console.error('Error creating hook:', error);
        return { success: false, error: 'Failed to create hook' };
    }
}

export async function getHooks(): Promise<Hook[]> {
    try {
        await ensureUserExists();

        const hooks = await prisma.hook.findMany({
            where: { userId: MOCK_USER_ID },
            orderBy: { createdAt: 'desc' },
        });

        return hooks.map(hook => ({
            id: hook.id,
            content: hook.content,
            type: hook.type as Hook['type'],
            emotion: hook.emotion as Hook['emotion'],
            topic: hook.topic,
            addedAt: hook.createdAt.toISOString(),
            performanceRating: hook.performanceRating as Hook['performanceRating'],
            usageCount: hook.usageCount,
            lastUsed: hook.lastUsed?.toISOString(),
        }));
    } catch (error) {
        console.error('Error fetching hooks:', error);
        return [];
    }
}

export async function deleteHook(id: string) {
    try {
        await prisma.hook.delete({
            where: { id },
        });

        revalidatePath('/library');
        return { success: true };
    } catch (error) {
        console.error('Error deleting hook:', error);
        return { success: false, error: 'Failed to delete hook' };
    }
}

// Helper function to ensure user exists
async function ensureUserExists() {
    const existingUser = await prisma.userProfile.findUnique({
        where: { clerkId: MOCK_USER_ID },
    });

    if (!existingUser) {
        await prisma.userProfile.create({
            data: {
                clerkId: MOCK_USER_ID,
                email: 'mock@example.com',
            },
        });
    }
}
