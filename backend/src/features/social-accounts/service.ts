import axios from 'axios';
import { prisma } from '../../lib/prisma';
import { InstagramOAuthToken, InstagramPageToken, SocialAccountDTO } from './model';

const FB_APP_ID = process.env.FACEBOOK_APP_ID;
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FB_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;

export class SocialAccountService {
  async getAuthUrl() {
    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${FB_REDIRECT_URI}&scope=instagram_basic,instagram_manage_messages,instagram_manage_comments,pages_show_list,pages_read_engagement`;
  }

  async exchangeCodeForToken(code: string): Promise<InstagramOAuthToken> {
    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        redirect_uri: FB_REDIRECT_URI,
        code,
      },
    });
    return response.data;
  }

  async getLongLivedToken(shortLivedToken: string): Promise<InstagramOAuthToken> {
    const response = await axios.get('https://graph.facebook.com/v18.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        fb_exchange_token: shortLivedToken,
      },
    });
    return response.data;
  }

  async getUserPages(userToken: string): Promise<InstagramPageToken[]> {
    const response = await axios.get('https://graph.facebook.com/v18.0/me/accounts', {
      params: { access_token: userToken },
    });
    return response.data.data;
  }

  async getInstagramBusinessAccount(pageId: string, pageToken: string) {
    const response = await axios.get(`https://graph.facebook.com/v18.0/${pageId}`, {
      params: {
        fields: 'instagram_business_account{id,username,profile_picture_url}',
        access_token: pageToken,
      },
    });
    return response.data.instagram_business_account;
  }

  async linkAccount(userId: string, data: SocialAccountDTO) {
    // Upsert social account
    return prisma.socialAccount.upsert({
      where: {
        userId_platform_accountId: {
          userId,
          platform: data.platform,
          accountId: data.accountId,
        },
      },
      update: {
        username: data.username,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpiry: data.tokenExpiry,
        avatarUrl: data.avatarUrl,
        isConnected: true,
      },
      create: {
        userId,
        platform: data.platform,
        username: data.username,
        accountId: data.accountId,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenExpiry: data.tokenExpiry,
        avatarUrl: data.avatarUrl,
        isActive: true, // Default to active if first or reconnect
        isConnected: true,
      },
    });
  }

  async getSocialAccounts(userId: string) {
    return prisma.socialAccount.findMany({
      where: { userId },
    });
  }
}

export const socialAccountService = new SocialAccountService();
