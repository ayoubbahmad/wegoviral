'use server';

import { prisma } from '@/lib/prisma';
import { Competitor } from '@/types/competitor';
import { revalidatePath } from 'next/cache';

// Mock user ID for now (will be replaced with Clerk user ID)
const MOCK_USER_ID = 'mock-user-1';

export async function createCompetitor(data: Omit<Competitor, 'id'>) {
    try {
        await ensureUserExists();

        const competitor = await prisma.competitor.create({
            data: {
                handle: data.handle,
                name: data.name,
                avatarUrl: data.avatarUrl,
                bio: data.bio || null,
                tags: data.tags,
                stats: data.stats,
                userId: MOCK_USER_ID,
            },
        });

        revalidatePath('/competitors');
        return { success: true, competitor };
    } catch (error) {
        console.error('Error creating competitor:', error);
        return { success: false, error: 'Failed to create competitor' };
    }
}

export async function getCompetitors(): Promise<Competitor[]> {
    try {
        await ensureUserExists();

        const competitors = await prisma.competitor.findMany({
            where: { userId: MOCK_USER_ID },
            orderBy: { createdAt: 'desc' },
        });

        return competitors.map(comp => ({
            id: comp.id,
            handle: comp.handle,
            name: comp.name,
            avatarUrl: comp.avatarUrl,
            bio: comp.bio || '',
            tags: comp.tags,
            stats: comp.stats as Competitor['stats'],
            isFollowing: true, // Default for now
        }));
    } catch (error) {
        console.error('Error fetching competitors:', error);
        return [];
    }
}

export async function deleteCompetitor(id: string) {
    try {
        await prisma.competitor.delete({
            where: { id },
        });

        revalidatePath('/competitors');
        return { success: true };
    } catch (error) {
        console.error('Error deleting competitor:', error);
        return { success: false, error: 'Failed to delete competitor' };
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
