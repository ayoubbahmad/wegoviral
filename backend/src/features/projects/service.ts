import { ProjectType } from '@prisma/client';
import { prisma } from '../../lib/prisma';

export const getProjects = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId },
    include: {
      _count: {
        select: { items: true },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
};

export const getProject = async (id: string, userId: string) => {
  return prisma.project.findFirst({
    where: { id, userId },
    include: {
      items: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });
};

export const createProject = async (
  userId: string,
  data: {
    name: string;
    type?: ProjectType;
    description?: string;
    metadata?: any;
  },
) => {
  return prisma.project.create({
    data: {
      ...data,
      userId,
    },
  });
};

export const updateProject = async (id: string, userId: string, data: any) => {
  return prisma.project.updateMany({
    where: { id, userId },
    data,
  });
};

export const deleteProject = async (id: string, userId: string) => {
  return prisma.project.deleteMany({
    where: { id, userId },
  });
};

// Project Items
export const createProjectItem = async (projectId: string, data: any) => {
  return prisma.projectItem.create({
    data: {
      ...data,
      projectId,
    },
  });
};

export const updateProjectItem = async (id: string, data: any) => {
  return prisma.projectItem.update({
    where: { id },
    data,
  });
};

export const deleteProjectItem = async (id: string) => {
  return prisma.projectItem.delete({
    where: { id },
  });
};
