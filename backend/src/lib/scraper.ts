import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

chromium.use(StealthPlugin());

import * as fs from 'fs';
import * as path from 'path';
// import * as cheerio from 'cheerio';

export interface ScrapedVideo {
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  views?: string;
  likes?: string;
  comments?: string;
  postedAt?: Date;
}

export async function scrapeProfileFeed(
  url: string,
  limit = 10,
): Promise<ScrapedVideo[]> {
  console.log(`Scraping profile feed for: ${url}`);
  const videos: ScrapedVideo[] = [];

  // --- DEV MODE: Check for local HTML dumps ---
  const projectRoot = path.resolve(__dirname, '../../..'); // Adjust path to root
  const scrapesDir = path.join(projectRoot, 'backend/scrapes');

  let htmlContent = '';
  let platform = '';

  if (url.includes('instagram.com')) {
    platform = 'instagram';
    const dumpPath = path.join(scrapesDir, 'instagram_profile.html');
    if (fs.existsSync(dumpPath) && fs.statSync(dumpPath).size > 100) {
      console.log('Using local Instagram dump:', dumpPath);
      htmlContent = fs.readFileSync(dumpPath, 'utf-8');
    }
  } else if (url.includes('tiktok.com')) {
    platform = 'tiktok';
    const dumpPath = path.join(scrapesDir, 'tiktok_profile.html');
    if (fs.existsSync(dumpPath) && fs.statSync(dumpPath).size > 100) {
      console.log('Using local TikTok dump:', dumpPath);
      htmlContent = fs.readFileSync(dumpPath, 'utf-8');
    }
  } else if (url.includes('youtube.com')) {
    platform = 'youtube';
    const dumpPath = path.join(scrapesDir, 'youtube_channel.html');
    if (fs.existsSync(dumpPath) && fs.statSync(dumpPath).size > 100) {
      console.log('Using local YouTube dump:', dumpPath);
      htmlContent = fs.readFileSync(dumpPath, 'utf-8');
    }
  }

  if (htmlContent) {
    // Use Playwright to parse the local HTML content
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      await page.setContent(htmlContent);

      if (platform === 'instagram') {
        console.log('Instagram scraping paused per user request.');
      } else if (platform === 'tiktok') {
        // TikTok scraping logic
        const scrapedVideos = await page.$$eval(
          '[data-e2e="user-post-item"]',
          (els, limit) => {
            return els.slice(0, limit).map((el) => {
              const link = el.querySelector('a')?.getAttribute('href');
              const desc = el.querySelector(
                '[data-e2e="user-post-item-desc"]',
              )?.textContent;
              const img = el.querySelector('img')?.getAttribute('src');
              const views = el.querySelector(
                '[data-e2e="video-views"]',
              )?.textContent;
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

        scrapedVideos.forEach((v: any) =>
          videos.push({ ...v, url: v.url || url }),
        );

        if (videos.length === 0) {
          const fallbackVideos = await page.$$eval(
            'a[href*="/video/"]',
            (els, limit) => {
              return els.slice(0, limit).map((el) => {
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
      } else if (platform === 'youtube') {
        // YouTube Shorts scraping logic
        // Verified selectors: ytd-compact-video-renderer -> a#thumbnail[href*="/shorts/"]
        const scrapedVideos = await page.$$eval(
          'ytd-compact-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer',
          (els, limit) => {
            const results: any[] = [];
            let count = 0;
            for (const el of els) {
              if (count >= limit) break;

              const thumbnailEl = el.querySelector('a#thumbnail');
              const href = thumbnailEl?.getAttribute('href');

              if (!href) continue;

              const img = el.querySelector('img')?.getAttribute('src');
              let title = el.querySelector('#video-title')?.textContent?.trim();
              // fallback for title
              if (!title)
                title = el
                  .querySelector('span#video-title')
                  ?.textContent?.trim();
              if (!title) title = 'YouTube Video';

              // Metadata line
              const metadata =
                el.querySelector('#metadata-line, .ytd-video-meta-block')
                  ?.textContent || '';
              const viewsMatch = metadata.match(/([\d.KMB]+)\s+views/);

              results.push({
                url: href,
                title,
                thumbnail: img,
                views: viewsMatch ? viewsMatch[1] : undefined,
                description: metadata,
              });
              count++;
            }
            return results;
          },
          limit,
        );

        scrapedVideos.forEach((v: any) => {
          const validUrl = v.url.startsWith('http')
            ? v.url
            : `https://www.youtube.com${v.url}`;
          videos.push({ ...v, url: validUrl });
        });
      }
    } catch (error) {
      console.error('Error parsing local HTML with Playwright:', error);
    } finally {
      await browser.close();
    }

    return videos;
  }

  // If no local file or empty, we would fall back to Playwright (Stealth)
  // For this task, we'll return empty or throw to prompt user
  console.log('No local dump found or empty. Returning empty list.');
  return [];
}

export interface ScrapedMetadata {
  title?: string;
  description?: string;
  thumbnail?: string;
  handle?: string;
  likes?: string | number;
  comments?: string | number;
  url: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedMetadata> {
  let browser;
  try {
    console.log('Starting stealth browser scrape for:', url);
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled',
      ],
    });

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 1,
    });

    const page = await context.newPage();

    // Set a reasonable timeout for the navigation
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });

    // Handle potential cookie popups or age gates for IG/TikTok
    if (url.includes('tiktok.com') || url.includes('instagram.com')) {
      await page.waitForTimeout(4000).catch(() => {});
      await page.evaluate(() => window.scrollBy(0, 500));
      await page.waitForTimeout(2000).catch(() => {});
    }

    // Extract basic metadata using page.evaluate
    const metadata = await page.evaluate(() => {
      const getMeta = (property: string) => {
        return document
          .querySelector(
            `meta[property="${property}"], meta[name="${property}"]`,
          )
          ?.getAttribute('content');
      };

      const title =
        getMeta('og:title') || getMeta('twitter:title') || document.title;
      const description =
        getMeta('og:description') ||
        getMeta('description') ||
        getMeta('twitter:description');
      const thumbnail =
        getMeta('og:image') || getMeta('twitter:image') || getMeta('thumbnail');
      const siteName = getMeta('og:site_name');

      return {
        title,
        description,
        thumbnail,
        siteName,
      };
    });

    let result: ScrapedMetadata = {
      title: metadata.title?.trim(),
      description: metadata.description?.trim(),
      thumbnail: metadata.thumbnail || undefined,
      handle: metadata.siteName?.trim(),
      url,
    };

    // --- Platform Specific Refinements ---

    const isInstagram =
      url.includes('instagram.com') || url.includes('instagram_sample');
    const isTikTok =
      url.includes('tiktok.com') || url.includes('tiktok_sample');
    const isYouTube =
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('youtube_video_sample') ||
      url.includes('youtube_short_sample');

    if (isInstagram) {
      const igData = await page.evaluate(() => {
        const getMetricByAria = (label: string) => {
          const svg = document.querySelector(`svg[aria-label="${label}"]`);
          if (!svg) return null;
          // Try to find the closest span or div containing text
          const container = svg.closest('div, span');
          if (container) {
            // Instagram often puts the count in a span nearby
            const textEl = container.parentElement?.querySelector(
              'span.html-span, span:not(:empty)',
            );
            if (textEl && /\d/.test(textEl.textContent || '')) {
              return textEl.textContent?.trim();
            }
          }
          return null;
        };

        // Try both English and common translations if possible, or use a regex on all aria-labels
        const findAriaMatch = (regex: RegExp) => {
          const els = document.querySelectorAll('[aria-label]');
          for (const el of Array.from(els)) {
            const label = el.getAttribute('aria-label') || '';
            if (regex.test(label)) {
              const textEl =
                el.querySelector('span, div') ||
                el.parentElement?.querySelector('span');
              if (textEl && /\d/.test(textEl.textContent || ''))
                return textEl.textContent?.trim();
            }
          }
          return null;
        };

        const domLikes = findAriaMatch(/like|j.aime/i);
        const domComments = findAriaMatch(/comment|commenter/i);

        try {
          const scripts = Array.from(
            document.querySelectorAll('script[type="application/json"]'),
          );
          for (const script of scripts) {
            const content = script.textContent || '';
            if (content.includes('like_count')) {
              const data = JSON.parse(content);
              // Deeply nested search for media data
              const findMedia = (obj: any): any => {
                if (!obj || typeof obj !== 'object') return null;
                if (obj.media && obj.media.like_count !== undefined)
                  return obj.media;
                for (const key in obj) {
                  const found = findMedia(obj[key]);
                  if (found) return found;
                }
                return null;
              };
              const media = findMedia(data);
              if (media) {
                return {
                  likes: domLikes || media.like_count,
                  comments: domComments || media.comment_count,
                  handle: media.user?.username,
                  caption: media.caption?.text,
                };
              }
            }
          }
        } catch (e) {
          /* ignore */
        }

        return { likes: domLikes, comments: domComments };
      });

      if (igData) {
        const normalizeMetric = (val: any) => {
          if (!val) return undefined;
          let s = String(val)
            .replace(/\u00A0/g, ' ')
            .trim(); // handle non-breaking spaces
          // User said "keep it as is from the platform", so I'll just remove extra spaces
          // and keep the decimal separator (comma) if present.
          return s.replace(/\s+/g, '');
        };

        if (igData.likes) result.likes = normalizeMetric(igData.likes);
        if (igData.comments) result.comments = normalizeMetric(igData.comments);
        if (igData.handle) result.handle = igData.handle;
        if (igData.caption) result.description = igData.caption;
      }

      // Fallbacks if DOM/JSON failed
      const desc = metadata.description || '';
      if (!result.likes || !result.comments) {
        const metricsMatch = desc.match(
          /([\d.,KMB]+)\s+likes,\s+([\d.,KMB]+)\s+comments/i,
        );
        if (metricsMatch) {
          if (!result.likes) result.likes = metricsMatch[1];
          if (!result.comments) result.comments = metricsMatch[2];
        }
      }

      if (!result.handle) {
        const handleMatch =
          desc.match(/-\s+([a-zA-Z0-9._]+)\s+on\s+/) ||
          desc.match(/\(@([a-zA-Z0-9._]+)\)/);
        if (handleMatch) result.handle = handleMatch[1];
      }

      // Cleanup title/description logic
      if (!result.description) {
        if (result.title?.includes('on Instagram:')) {
          const captionMatch = result.title.match(/on Instagram: "(.*)"/s);
          result.description = captionMatch ? captionMatch[1] : result.title;
        } else {
          result.description = result.title || result.description;
        }
      }
      result.title = undefined;
    } else if (isTikTok) {
      const tiktokData = await page.evaluate(() => {
        const getMetric = (selector: string) => {
          const el = document.querySelector(selector);
          return el ? el.textContent?.trim() : null;
        };

        const domCaption = document
          .querySelector('[data-e2e="video-desc"]')
          ?.textContent?.trim();
        const domHandle =
          document
            .querySelector('[data-e2e="user-title"]')
            ?.textContent?.trim() ||
          document
            .querySelector('[data-e2e="browser-nickname"]')
            ?.textContent?.trim();
        const domLikes = getMetric('[data-e2e="like-count"]');
        const domComments = getMetric('[data-e2e="comment-count"]');

        try {
          const script =
            document.querySelector('#__UNIVERSAL_DATA_FOR_REHYDRATION__') ||
            document.querySelector('#SIGI_STATE');
          if (script) {
            const data = JSON.parse(script.textContent || '{}');
            const videoData =
              data.__DEFAULT_SCOPE__?.['webapp.video-detail']?.itemInfo
                ?.itemStruct ||
              data.__DEFAULT_SCOPE__?.['webapp.video-detail']?.videoInfo
                ?.itemStruct ||
              Object.values(data.ItemModule || {})[0];

            if (videoData) {
              return {
                title: videoData.desc,
                thumbnail:
                  videoData.video?.cover || videoData.video?.originCover,
                handle:
                  videoData.author?.uniqueId ||
                  videoData.author?.nickname ||
                  domHandle,
                likes: domLikes || videoData.stats?.diggCount,
                comments: domComments || videoData.stats?.commentCount,
                domCaption,
              };
            }
          }
        } catch (e) {
          /* ignore */
        }

        return {
          title: domCaption,
          handle: domHandle,
          likes: domLikes,
          comments: domComments,
          domCaption,
        };
      });

      if (tiktokData) {
        result.title = undefined;
        result.description =
          tiktokData.title || tiktokData.domCaption || result.description;
        result.thumbnail = (tiktokData as any).thumbnail || result.thumbnail;
        result.handle = (tiktokData as any).handle || result.handle;

        result.likes = tiktokData.likes || undefined;
        result.comments = tiktokData.comments || undefined;
      } else {
        if (result.title === 'TikTok - Make Your Day') result.title = undefined;
        const tiktokUrlMatch = url.match(/@([^/"\s?]+)/);
        if (tiktokUrlMatch) result.handle = tiktokUrlMatch[1];
      }
    } else if (isYouTube) {
      const ytData = await page.evaluate(() => {
        return (
          document
            .querySelector('link[itemprop="name"]')
            ?.getAttribute('content') ||
          document.querySelector('#upload-info #channel-name a')?.textContent
        );
      });
      result.handle = ytData?.trim() || result.handle;
    }

    console.log(
      'Successfully scraped and refined with Playwright (Stealth):',
      result,
    );
    return result;
  } catch (error: any) {
    console.error(
      'Playwright stealth scraping error for URL:',
      url,
      error.message,
    );
    return { url };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
