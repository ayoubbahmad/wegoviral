import { TProjectType } from '../types';

export interface ProjectItem {
  id: string;
  projectId: string;
  type: string;
  title: string;
  content?: any;
  status?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

// Response Types
export interface Project {
  id: string;
  name: string;
  type: TProjectType;
  description?: string;
  status: string;
  metadata?: any;
  items?: ProjectItem[];
  _count?: {
    items: number;
  };
  createdAt: string;
  updatedAt: string;
}
