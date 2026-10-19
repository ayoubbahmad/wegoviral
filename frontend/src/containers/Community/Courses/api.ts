import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';
import {
  AttachmentInput,
  CourseDetail,
  CourseInput,
  CourseStats,
  CourseSummary,
  EditableCourse,
  EditableLesson,
  EditableModule,
  LessonInput,
  LessonView,
} from '@/types/courses';
import type { AccessRuleInput } from '../Events/api';

export const courseKeys = {
  all: ['courses'] as const,
  list: ['courses', 'list'] as const,
  detail: (id: string) => ['courses', 'detail', id] as const,
  lesson: (courseId: string, lessonId: string) => ['courses', 'lesson', courseId, lessonId] as const,
  edit: (id: string) => ['courses', 'edit', id] as const,
  stats: (id: string) => ['courses', 'stats', id] as const,
  access: (id: string) => ['courses', 'access', id] as const,
};

export const useCourses = () =>
  useQuery({
    queryKey: courseKeys.list,
    queryFn: async () => (await apiClient.get<CourseSummary[]>('/courses')).data,
  });

export const useCourse = (id: string) =>
  useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: async () => (await apiClient.get<CourseDetail>(`/courses/${id}`)).data,
  });

export const useLesson = (courseId: string, lessonId: string | null) =>
  useQuery({
    queryKey: courseKeys.lesson(courseId, lessonId ?? ''),
    queryFn: async () => (await apiClient.get<LessonView>(`/courses/${courseId}/lessons/${lessonId}`)).data,
    enabled: Boolean(lessonId),
    // Signed file links expire after an hour
    staleTime: 30 * 60_000,
  });

const useRefreshCourses = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: courseKeys.all });
};

export const useCompleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, lessonId, completed }: { courseId: string; lessonId: string; completed: boolean }) =>
      (
        await (completed
          ? apiClient.put<{ completed: boolean; courseCompleted: boolean }>(`/courses/${courseId}/lessons/${lessonId}/complete`)
          : apiClient.delete<{ completed: boolean; courseCompleted: boolean }>(`/courses/${courseId}/lessons/${lessonId}/complete`))
      ).data,
    onSuccess: (_result, { courseId, lessonId }) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(courseId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.lesson(courseId, lessonId) });
      queryClient.invalidateQueries({ queryKey: courseKeys.list });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });
};

// ─── Builder ─────────────────────────────────────────────────────────────────

export const useEditableCourse = (id: string) =>
  useQuery({
    queryKey: courseKeys.edit(id),
    queryFn: async () => (await apiClient.get<EditableCourse>(`/courses/${id}/edit`)).data,
  });

export const useCreateCourse = () => {
  const refresh = useRefreshCourses();
  return useMutation({
    mutationFn: async (input: { title: string; description?: string }) => (await apiClient.post<CourseDetail>('/courses', input)).data,
    onSuccess: refresh,
  });
};

export const useUpdateCourse = () => {
  const refresh = useRefreshCourses();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: CourseInput }) => (await apiClient.patch<CourseDetail>(`/courses/${id}`, input)).data,
    onSuccess: refresh,
  });
};

export const useDeleteCourse = () => {
  const refresh = useRefreshCourses();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/courses/${id}`)).data,
    onSuccess: refresh,
  });
};

export const useSaveOutline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ courseId, modules }: { courseId: string; modules: { id: string; lessonIds: string[] }[] }) =>
      (await apiClient.put<EditableCourse>(`/courses/${courseId}/outline`, { modules })).data,
    onSuccess: (course) => {
      queryClient.setQueryData(courseKeys.edit(course.id), course);
      queryClient.invalidateQueries({ queryKey: courseKeys.detail(course.id) });
    },
  });
};

export const useSaveModule = () => {
  const refresh = useRefreshCourses();
  return useMutation({
    mutationFn: async ({ courseId, id, input }: { courseId: string; id?: string; input: { title?: string; dripDays?: number | null } }) =>
      (id ? await apiClient.patch<EditableModule>(`/courses/modules/${id}`, input) : await apiClient.post<EditableModule>(`/courses/${courseId}/modules`, input)).data,
    onSuccess: refresh,
  });
};

export const useDeleteModule = () => {
  const refresh = useRefreshCourses();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/courses/modules/${id}`)).data,
    onSuccess: refresh,
  });
};

export const useSaveLesson = () => {
  const refresh = useRefreshCourses();
  return useMutation({
    mutationFn: async ({ moduleId, id, input }: { moduleId?: string; id?: string; input: LessonInput }) =>
      (id ? await apiClient.patch<EditableLesson>(`/courses/lessons/${id}`, input) : await apiClient.post<EditableLesson>(`/courses/modules/${moduleId}/lessons`, input)).data,
    onSuccess: refresh,
  });
};

export const useDeleteLesson = () => {
  const refresh = useRefreshCourses();
  return useMutation({
    mutationFn: async (id: string) => (await apiClient.delete(`/courses/lessons/${id}`)).data,
    onSuccess: refresh,
  });
};

/** Uploads a lesson file into the private course bucket. */
export async function uploadCourseFile(courseId: string, file: File): Promise<AttachmentInput> {
  const { data } = await apiClient.post<{ bucket: string; path: string; token: string }>(`/courses/${courseId}/uploads`, {
    fileName: file.name,
    size: file.size,
  });
  const { error } = await supabase.storage.from(data.bucket).uploadToSignedUrl(data.path, data.token, file, {
    contentType: file.type || 'application/octet-stream',
  });
  if (error) throw new Error(`Could not upload ${file.name}: ${error.message}`);
  return { name: file.name, storagePath: data.path, size: file.size };
}

export const useCourseStats = (id: string, enabled: boolean) =>
  useQuery({
    queryKey: courseKeys.stats(id),
    queryFn: async () => (await apiClient.get<CourseStats>(`/courses/${id}/stats`)).data,
    enabled,
  });

export const useCourseAccess = (id: string) =>
  useQuery({
    queryKey: courseKeys.access(id),
    queryFn: async () => (await apiClient.get<AccessRuleInput | null>(`/courses/${id}/access`)).data,
  });

export const useSaveCourseAccess = () => {
  const refresh = useRefreshCourses();
  return useMutation({
    mutationFn: async ({ id, rule }: { id: string; rule: AccessRuleInput }) => (await apiClient.put(`/courses/${id}/access`, rule)).data,
    onSuccess: refresh,
  });
};
