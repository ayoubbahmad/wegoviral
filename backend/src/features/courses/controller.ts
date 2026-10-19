import { Response } from 'express';
import { ZodError } from 'zod';
import * as coursesService from './service';
import { setAccessRule } from '../admin/access.service';
import { AccessRuleSchema, AdminError } from '../admin/model';
import {
  CourseError,
  CourseUploadSchema,
  CreateCourseSchema,
  CreateLessonSchema,
  CreateModuleSchema,
  OutlineSchema,
  UpdateCourseSchema,
  UpdateLessonSchema,
  UpdateModuleSchema,
} from './model';

const handle =
  (action: string, fn: (req: any, res: Response) => Promise<unknown>) =>
  async (req: any, res: Response) => {
    try {
      await fn(req, res);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.issues[0]?.message || 'Invalid request' });
      }
      if (error instanceof CourseError || error instanceof AdminError) {
        return res.status(error.status).json({ error: error.message });
      }
      req.log?.error({ err: error }, `${action} failed`);
      res.status(500).json({ error: `Failed to ${action}` });
    }
  };

export const listCourses = handle('load courses', async (req, res) => {
  res.json(await coursesService.listCourses(req.user));
});

export const getCourse = handle('load course', async (req, res) => {
  res.json(await coursesService.getCourse(req.user, req.params.id));
});

export const createCourse = handle('create course', async (req, res) => {
  res.status(201).json(await coursesService.createCourse(req.user, CreateCourseSchema.parse(req.body)));
});

export const updateCourse = handle('update course', async (req, res) => {
  res.json(await coursesService.updateCourse(req.user, req.params.id, UpdateCourseSchema.parse(req.body)));
});

export const deleteCourse = handle('delete course', async (req, res) => {
  await coursesService.deleteCourse(req.user, req.params.id);
  res.status(204).end();
});

export const getLesson = handle('load lesson', async (req, res) => {
  res.json(await coursesService.getLesson(req.user, req.params.id, req.params.lessonId));
});

export const completeLesson = handle('save progress', async (req, res) => {
  res.json(await coursesService.setLessonCompleted(req.user, req.params.id, req.params.lessonId, true));
});

export const uncompleteLesson = handle('save progress', async (req, res) => {
  res.json(await coursesService.setLessonCompleted(req.user, req.params.id, req.params.lessonId, false));
});

export const getCourseForEditing = handle('load course', async (req, res) => {
  res.json(await coursesService.getCourseForEditing(req.user, req.params.id));
});

export const saveOutline = handle('save order', async (req, res) => {
  res.json(await coursesService.saveOutline(req.user, req.params.id, OutlineSchema.parse(req.body)));
});

export const createModule = handle('add module', async (req, res) => {
  res.status(201).json(await coursesService.createModule(req.user, req.params.id, CreateModuleSchema.parse(req.body)));
});

export const updateModule = handle('update module', async (req, res) => {
  res.json(await coursesService.updateModule(req.user, req.params.moduleId, UpdateModuleSchema.parse(req.body)));
});

export const deleteModule = handle('delete module', async (req, res) => {
  await coursesService.deleteModule(req.user, req.params.moduleId);
  res.status(204).end();
});

export const createLesson = handle('add lesson', async (req, res) => {
  res.status(201).json(await coursesService.createLesson(req.user, req.params.moduleId, CreateLessonSchema.parse(req.body)));
});

export const updateLesson = handle('update lesson', async (req, res) => {
  res.json(await coursesService.updateLesson(req.user, req.params.lessonId, UpdateLessonSchema.parse(req.body)));
});

export const deleteLesson = handle('delete lesson', async (req, res) => {
  await coursesService.deleteLesson(req.user, req.params.lessonId);
  res.status(204).end();
});

export const createUpload = handle('prepare upload', async (req, res) => {
  const { fileName } = CourseUploadSchema.parse(req.body);
  res.status(201).json(await coursesService.createAttachmentUpload(req.user, req.params.id, fileName));
});

export const getStats = handle('load course stats', async (req, res) => {
  res.json(await coursesService.getCourseStats(req.user, req.params.id));
});

export const getAccess = handle('load access rule', async (req, res) => {
  res.json(await coursesService.getCourseAccess(req.user, req.params.id));
});

export const setAccess = handle('save access rule', async (req, res) => {
  await coursesService.assertCanManage(req.user, req.params.id);
  res.json(await setAccessRule(req.user, 'course', req.params.id, AccessRuleSchema.parse(req.body)));
});
