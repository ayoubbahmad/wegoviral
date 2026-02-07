import { SocialAccount } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string | null;
  socialAccounts?: SocialAccount[];
}

export interface AuthResponse {
  status: string;
  token?: string;
  user: AuthUser;
}

export interface RegisterDTO {
  email: string;
  passwordHash: string;
  username: string;
  name?: string;
}

export interface LoginDTO {
  email: string;
  passwordHash: string;
}
