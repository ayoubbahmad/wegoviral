import { SocialAccount, UserRole } from "@prisma/client";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  avatarUrl?: string | null;
  role: UserRole;
  socialAccounts?: SocialAccount[];
}
