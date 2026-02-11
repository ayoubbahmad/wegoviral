import { Page } from 'playwright';
import { ScrapedVideo } from './types';

export const scrapeTikTok = async (
  page: Page,
  limit: number,
  url: string,
): Promise<ScrapedVideo[]> => {
  const videos: ScrapedVideo[] = [];

  const scrapedVideos = await page.$$eval(
    '[data-e2e="user-post-item"]',
    (els: any[], limit: number) => {
      return els.slice(0, limit).map((el: any) => {
        const link = el.querySelector('a')?.getAttribute('href');
        const desc = el.querySelector(
          '[data-e2e="user-post-item-desc"]',
        )?.textContent;
        const img = el.querySelector('img')?.getAttribute('src');
        const views = el.querySelector('[data-e2e="video-views"]')?.textContent;
        return {
          url: link,
          thumbnail: img,
          title: desc || 'TikTok Video',
          description: desc,
          views,
        };
      });
    },
    limit,
  );

  scrapedVideos.forEach((v: any) => videos.push({ ...v, url: v.url || url }));

  if (videos.length === 0) {
    const fallbackVideos = await page.$$eval(
      'a[href*="/video/"]',
      (els: any[], limit: number) => {
        return els.slice(0, limit).map((el: any) => {
          const href = el.getAttribute('href');
          const img = el.querySelector('img')?.getAttribute('src');
          const text = el.textContent;
          return {
            url: href,
            thumbnail: img,
            title: text?.trim().substring(0, 50),
          };
        });
      },
      limit,
    );
    fallbackVideos.forEach((v: any) =>
      videos.push({ ...v, url: v.url || url }),
    );
  }

  return videos;
};
