import type { CourseSummary } from '@/types/courses';

/** Turns a YouTube, Vimeo or Loom link into an embeddable player URL; other links play as a video file. */
export function videoSource(url: string): { kind: 'embed' | 'file'; src: string } {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\.|^m\./, '');
    if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
      const id = parsed.searchParams.get('v') ?? parsed.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]+)/)?.[1];
      if (id) return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` };
    }
    if (host === 'youtu.be') return { kind: 'embed', src: `https://www.youtube-nocookie.com/embed/${parsed.pathname.slice(1)}?rel=0` };
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const [, id, hash] = parsed.pathname.match(/(\d+)(?:\/(\w+))?/) ?? [];
      if (id) return { kind: 'embed', src: `https://player.vimeo.com/video/${id}${hash ? `?h=${hash}` : ''}` };
    }
    if (host === 'loom.com') {
      const id = parsed.pathname.match(/\/(?:share|embed)\/(\w+)/)?.[1];
      if (id) return { kind: 'embed', src: `https://www.loom.com/embed/${id}` };
    }
  } catch {
    // not a URL: fall through
  }
  return { kind: 'file', src: url };
}

export const formatMinutes = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  return minutes % 60 ? `${hours} h ${minutes % 60} min` : `${hours} h`;
};

export const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export const progressPercent = (course: Pick<CourseSummary, 'progress' | 'lessonCount'>) =>
  course.progress && course.lessonCount ? Math.round((course.progress.completedLessons / course.lessonCount) * 100) : 0;
