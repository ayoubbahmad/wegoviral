import { PrismaClient } from '@prisma/client';
import { CreateAutomationDTO, UpdateAutomationDTO } from './model';

const prisma = new PrismaClient();

export class AutomationService {
  async getAllAutomations(userId: string) {
    return prisma.automation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAutomationById(id: string, userId: string) {
    return prisma.automation.findFirst({
      where: { id, userId },
    });
  }

  async createAutomation(userId: string, data: CreateAutomationDTO) {
    return prisma.automation.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateAutomation(id: string, userId: string, data: UpdateAutomationDTO) {
    // Verify ownership
    const automation = await this.getAutomationById(id, userId);
    if (!automation) return null;

    return prisma.automation.update({
      where: { id },
      data,
    });
  }

  async deleteAutomation(id: string, userId: string) {
    // Verify ownership
    const automation = await this.getAutomationById(id, userId);
    if (!automation) return null;

    return prisma.automation.delete({
      where: { id },
    });
  }

  // Simulated trigger logic for keywords
  async processKeywordTrigger(socialAccountId: string, handle: string, comment: string, mediaId?: string) {
    const automations = await prisma.automation.findMany({
      where: { 
        socialAccountId,
        active: true 
      }
    });

    for (const automation of automations) {
      // Logic for matching keyword and post binding
      const keywordMatched = comment.toLowerCase().includes(automation.triggerKeyword.toLowerCase());
      const postMatched = automation.isGlobal || (mediaId && automation.instagramPostId === mediaId);

      if (keywordMatched && postMatched) {
        console.log(`[AUTOMATION] Trigger matched: "${automation.triggerKeyword}" for user @${handle}`);
        console.log(`[AUTOMATION] Sending DM: "${automation.responseMessage}"`);
        
        if (automation.commentReplyEnabled && automation.commentReplyMessage) {
           console.log(`[AUTOMATION] Replying to comment: "${automation.commentReplyMessage}"`);
        }

        // Update Stats
        await prisma.automation.update({
          where: { id: automation.id },
          data: {
            runCount: { increment: 1 },
            lastRunAt: new Date()
          }
        });
        
        // In a real implementation, we would call the Social Platform API here
        return { 
          triggered: true, 
          message: automation.responseMessage,
          commentReply: automation.commentReplyEnabled ? automation.commentReplyMessage : null,
          automationId: automation.id 
        };
      }
    }

    return { triggered: false };
  }
}

export const automationService = new AutomationService();
