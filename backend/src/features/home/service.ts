import { scriptsService } from '../scripts/service';
import { performanceService } from '../performance/service';
import { HomeSummaryResponse } from './model';

export class HomeService {
  async getHomeSummary(userId: string): Promise<HomeSummaryResponse> {
    // 1. Fetch real data from existing services
    const [scripts, posts] = await Promise.all([
      scriptsService.getAllScripts(userId),
      // We take the first social account for now, or would normally aggregate across all
      this.getRecentPosts(userId)
    ]);

    // 2. Mock Stats (Normally these would be calculated/aggregated)
    const stats = [
      { label: "Total Views", value: "2.4M", trend: 12, icon: "Globe" },
      { label: "Engagement", value: "8.2%", trend: 5, icon: "Flame" },
      { label: "Viral Posts", value: "14", trend: 2, icon: "Trophy" },
      { label: "Growth", value: "+12k", trend: 18, icon: "ArrowUpRight" }
    ];

    // 3. Mock Projects & Challenges
    const projects = [
      { name: "30-Day Growth Challenge", progress: 65, color: "bg-amber-500" },
      { name: "WeGoViral Launch", progress: 92, color: "bg-emerald-500" }
    ];

    const challenges = [
      { name: "Viral Hook Marathon", recruits: 1284, hot: true },
      { name: "Consistency Sprint", recruits: 450, hot: false }
    ];

    return {
      stats,
      scripts: scripts.slice(0, 2), // Top 2 recent scripts
      videos: (posts || []).slice(0, 2), // Top 2 recent videos
      projects,
      challenges
    };
  }

  private async getRecentPosts(userId: string) {
    // For now we just get posts from any social account associated with the user
    // In a more complex app, we'd query across all accounts
    try {
        // This is a bit of a hack since performanceService.getUserPosts needs a socialAccountId
        // We'll just return some mock videos for now if we can't easily find a social account
        return [
            { id: "v1", title: "Viral Hook Analysis: Episode #12", views: "2.4M", postedAt: "2 days ago" },
            { id: "v2", title: "Viral Hook Analysis: Episode #13", views: "1.2M", postedAt: "5 days ago" }
        ];
    } catch (e) {
        return [];
    }
  }
}

export const homeService = new HomeService();
