import { prisma } from '../../lib/prisma';
import { CreateScriptDTO, UpdateScriptDTO, ScriptContent } from './model';

export class ScriptTemplatesService {
  // Helper to calculate word count from script content
  private static calculateWordCount(content: ScriptContent): number {
    if (!content || !content.generatedContent) return 0;
    return content.generatedContent.trim().split(/\s+/).length;
  }

  // Helper to generate excerpt
  private static generateExcerpt(content: ScriptContent): string {
    if (!content || !content.generatedContent) return '';
    const text = content.generatedContent.replace(/\n+/g, ' ').trim();
    return text.length > 120 ? text.substring(0, 117) + '...' : text;
  }

  // Format script for response
  private static formatScript(script: any) {
    return {
      ...script,
      lastUpdated: script.updatedAt.toISOString(),
      wordCount: script.wordCount || this.calculateWordCount(script.content as ScriptContent),
      excerpt: script.excerpt || this.generateExcerpt(script.content as ScriptContent),
      status: script.status || 'Draft'
    };
  }

  async getAllScripts(userId: string) {
    const scripts = await prisma.scriptTemplate.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return scripts.map(s => ScriptTemplatesService.formatScript(s));
  }

  async getScriptById(id: string, userId: string) {
    const script = await prisma.scriptTemplate.findFirst({
      where: { id, userId }
    });
    if (!script) return null;
    return ScriptTemplatesService.formatScript(script);
  }

  async createScriptTemplate(userId: string, data: CreateScriptDTO) {
    const wordCount = ScriptTemplatesService.calculateWordCount(data.content);
    const excerpt = ScriptTemplatesService.generateExcerpt(data.content);

    const script = await prisma.scriptTemplate.create({
      data: {
        title: data.title,
        content: data.content as any,
        category: data.category || 'General',
        status: 'Completed',
        excerpt,
        wordCount,
        userId,
      },
    });
    return ScriptTemplatesService.formatScript(script);
  }

  async updateScriptTemplate(id: string, userId: string, data: UpdateScriptDTO) {
    // Ensure user owns the script
    const existingScript = await prisma.scriptTemplate.findFirst({
      where: { id, userId }
    });

    if (!existingScript) return null;

    const wordCount = data.content ? ScriptTemplatesService.calculateWordCount(data.content) : existingScript.wordCount;
    const excerpt = data.content ? ScriptTemplatesService.generateExcerpt(data.content) : existingScript.excerpt;

    const updatedScript = await prisma.scriptTemplate.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content as any,
        category: data.category,
        status: data.status,
        excerpt,
        wordCount,
      },
    });
    return ScriptTemplatesService.formatScript(updatedScript);
  }

  async deleteScript(id: string, userId: string) {
    const script = await prisma.scriptTemplate.findFirst({
      where: { id, userId }
    });

    if (!script) return false;

    await prisma.scriptTemplate.delete({
      where: { id },
    });
    return true;
  }
}

export const scriptTemplatesService = new ScriptTemplatesService();
