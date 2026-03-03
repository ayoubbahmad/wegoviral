import { Response } from 'express';
import * as projectsService from './service';
import {
  CreateProjectSchema,
  UpdateProjectSchema,
  CreateProjectItemSchema,
} from './model';

export const getProjects = async (req: any, res: Response) => {
  try {
    const projects = await projectsService.getProjects(req.user.id);
    res.json(projects);
  } catch (error) {
    console.error('Get Projects Error:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

export const getProject = async (req: any, res: Response) => {
  try {
    const project = await projectsService.getProject(
      req.params.id,
      req.user.id,
    );
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (error) {
    console.error('Get Project Error:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};

export const createProject = async (req: any, res: Response) => {
  try {
    const validatedData = CreateProjectSchema.parse(req.body);
    const project = await projectsService.createProject(
      req.user.id,
      validatedData,
    );
    res.status(201).json(project);
  } catch (error: any) {
    if (error.name === 'ZodError')
      return res.status(400).json({ error: error.errors });
    console.error('Create Project Error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const updateProject = async (req: any, res: Response) => {
  try {
    const validatedData = UpdateProjectSchema.parse(req.body);
    const result = await projectsService.updateProject(
      req.params.id,
      req.user.id,
      validatedData,
    );
    if (result.count === 0)
      return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project updated successfully' });
  } catch (error: any) {
    if (error.name === 'ZodError')
      return res.status(400).json({ error: error.errors });
    console.error('Update Project Error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req: any, res: Response) => {
  try {
    const result = await projectsService.deleteProject(
      req.params.id,
      req.user.id,
    );
    if (result.count === 0)
      return res.status(404).json({ error: 'Project not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Delete Project Error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};

// Items
export const createProjectItem = async (req: any, res: Response) => {
  try {
    const validatedData = CreateProjectItemSchema.parse(req.body);
    const item = await projectsService.createProjectItem(
      req.params.projectId,
      validatedData,
    );
    res.status(201).json(item);
  } catch (error: any) {
    if (error.name === 'ZodError')
      return res.status(400).json({ error: error.errors });
    console.error('Create Item Error:', error);
    res.status(500).json({ error: 'Failed to create project item' });
  }
};
