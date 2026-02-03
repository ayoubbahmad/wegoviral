'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const MOCK_USER_ID = 'mock-user-1';

export type ScriptTemplate = {
    id: string;
    title: string;
    content: any;
    category: string;
    hookId?: string;
    createdAt: string;
};

export async function createScriptTemplate(data: Omit<ScriptTemplate, 'id' | 'createdAt'>) {
    try {
        await ensureUserExists();

        const script = await prisma.scriptTemplate.create({
            data: {
                title: data.title,
                content: data.content,
                category: data.category,
                hookId: data.hookId,
                userId: MOCK_USER_ID,
            },
        });

        revalidatePath('/library');
        return { success: true, script };
    } catch (error) {
        console.error('Error creating script template:', error);
        return { success: false, error: 'Failed to create script template' };
    }
}

export async function getScriptTemplates(): Promise<ScriptTemplate[]> {
    try {
        await ensureUserExists();

        const scripts = await prisma.scriptTemplate.findMany({
            where: { userId: MOCK_USER_ID },
            orderBy: { createdAt: 'desc' },
        });

        return scripts.map(s => ({
            id: s.id,
            title: s.title,
            content: s.content,
            category: s.category,
            hookId: s.hookId || undefined,
            createdAt: s.createdAt.toISOString(),
        }));
    } catch (error) {
        console.error('Error fetching script templates:', error);
        return [];
    }
}

export async function deleteScriptTemplate(id: string) {
    try {
        await prisma.scriptTemplate.delete({
            where: { id },
        });

        revalidatePath('/library');
        return { success: true };
    } catch (error) {
        console.error('Error deleting script template:', error);
        return { success: false, error: 'Failed to delete script template' };
    }
}

async function ensureUserExists() {
    const existingUser = await prisma.userProfile.findUnique({
        where: { id: MOCK_USER_ID },
    });

    if (!existingUser) {
        await prisma.userProfile.create({
            data: {
                id: MOCK_USER_ID,
                email: 'mock@example.com',
                username: 'demo_creator',
                passwordHash: 'dummy_hash',
                name: 'Demo Creator',
            },
        });
    }
}
