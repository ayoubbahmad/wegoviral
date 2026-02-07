import { prisma } from '../../lib/prisma';
import { CreateHookDTO, UpdateHookDTO } from './model';

export class HooksService {
  private formatHook(hook: any) {
    return {
      ...hook,
      addedAt: hook.createdAt.toISOString(),
      lastUsed: hook.lastUsed?.toISOString(),
    };
  }

  async getAllHooks(userId: string) {
    const hooks = await prisma.hook.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return hooks.map(hook => this.formatHook(hook));
  }

  async createHook(userId: string, data: CreateHookDTO) {
    const hook = await prisma.hook.create({
      data: {
        content: data.content,
        type: data.type,
        emotion: data.emotion || 'Neutral',
        topic: data.topic || 'General',
        performanceRating: data.performanceRating || 0,
        userId,
        socialAccountId: data.socialAccountId
      },
    });
    return this.formatHook(hook);
  }

  async updateHook(id: string, userId: string, data: UpdateHookDTO) {
    const hook = await prisma.hook.findFirst({
      where: { id, userId }
    });

    if (!hook) return null;

    const updatedHook = await prisma.hook.update({
      where: { id },
      data,
    });
    return this.formatHook(updatedHook);
  }

  async deleteHook(id: string, userId: string) {
    const hook = await prisma.hook.findFirst({
      where: { id, userId }
    });

    if (!hook) return false;

    await prisma.hook.delete({
      where: { id },
    });
    return true;
  }
}

export const hooksService = new HooksService();
