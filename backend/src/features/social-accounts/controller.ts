import { Request, Response } from 'express';
import { socialAccountService } from './service';

export class SocialAccountController {
  async getAuthUrl(req: Request, res: Response) {
    try {
      const url = await socialAccountService.getAuthUrl();
      res.json({ url });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async handleCallback(req: Request, res: Response) {
    const { code } = req.query;
    const userId = (req as any).user?.id;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Code is required' });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
      // 1. Exchange code for short-lived token
      const shortToken = await socialAccountService.exchangeCodeForToken(code);
      
      // 2. Exchange for long-lived token
      const longToken = await socialAccountService.getLongLivedToken(shortToken.access_token);
      
      // 3. Get user's FB pages
      const pages = await socialAccountService.getUserPages(longToken.access_token);
      
      const linkedAccounts = [];

      // 4. For each page, check for Instagram Business Account
      for (const page of pages) {
        const igAccount = await socialAccountService.getInstagramBusinessAccount(page.id, page.access_token);
        
        if (igAccount) {
          // Link this account to the user
          const linked = await socialAccountService.linkAccount(userId, {
            platform: 'Instagram',
            username: igAccount.username,
            accountId: igAccount.id,
            accessToken: page.access_token, // Page token is usually what's needed for messaging
            avatarUrl: igAccount.profile_picture_url
          });
          linkedAccounts.push(linked);
        }
      }

      res.json({ success: true, accounts: linkedAccounts });
    } catch (error: any) {
      console.error('[OAuth Callback Error]', error.response?.data || error.message);
      res.status(500).json({ error: 'Failed to link Instagram account' });
    }
  }

  async getMyAccounts(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const accounts = await socialAccountService.getSocialAccounts(userId);
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export const socialAccountController = new SocialAccountController();
