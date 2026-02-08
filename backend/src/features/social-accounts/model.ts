export interface InstagramOAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface InstagramPageToken {
  access_token: string;
  id: string; // Page ID
  name: string;
}

export interface SocialAccountDTO {
  platform: string;
  username: string;
  accountId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: Date;
  avatarUrl?: string;
}
