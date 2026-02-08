export interface Automation {
  id: string;
  name: string;
  triggerKeyword: string;
  responseMessage: string;
  platform: string | null;
  active: boolean;
  userId: string;
  socialAccountId: string | null;
  runCount: number;
  lastRunAt: Date | null;
  commentReplyEnabled: boolean;
  commentReplyMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAutomationDTO {
  name: string;
  triggerKeyword: string;
  responseMessage: string;
  platform?: string;
  socialAccountId?: string;
  commentReplyEnabled?: boolean;
  commentReplyMessage?: string;
}

export interface UpdateAutomationDTO {
  name?: string;
  triggerKeyword?: string;
  responseMessage?: string;
  platform?: string;
  active?: boolean;
  socialAccountId?: string;
  commentReplyEnabled?: boolean;
  commentReplyMessage?: string;
}
