import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import path from 'path';
import fs from 'fs';
import { scrapeTikTok } from './scrapers/tiktok';
import { scrapeInstagram } from './scrapers/instagram';
import { scrapeYouTube } from './scrapers/youtube';
import { ScrapedVideo } from './scrapers/types';

chromium.use(StealthPlugin());

export async function scrapeProfileFeed(
  url: string,
  limit = 10,
): Promise<ScrapedVideo[]> {
  console.log(`Scraping profile feed for: ${url}`);

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
    const shortsDump = path.join(scrapesDir, 'youtube_shorts.html');
    const channelDump = path.join(scrapesDir, 'youtube_channel.html');

    if (fs.existsSync(shortsDump) && fs.statSync(shortsDump).size > 100) {
      console.log('Using local YouTube Shorts dump:', shortsDump);
      htmlContent = fs.readFileSync(shortsDump, 'utf-8');
    } else if (
      fs.existsSync(channelDump) &&
      fs.statSync(channelDump).size > 100
    ) {
      console.log('Using local YouTube Channel dump:', channelDump);
      htmlContent = fs.readFileSync(channelDump, 'utf-8');
    }
  }

  if (htmlContent) {
    // Use Playwright to parse the local HTML content
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();

      // Optimization: Strip scripts from large HTML dumps (like YouTube 8MB files)
      // to prevent browser parser from stalling/truncating the DOM.
      const cleanHtml = htmlContent.replace(
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        '',
      );
      await page.setContent(cleanHtml);

      if (platform === 'instagram') {
        return await scrapeInstagram(page, limit);
      } else if (platform === 'tiktok') {
        return await scrapeTikTok(page, limit, url);
      } else if (platform === 'youtube') {
        return await scrapeYouTube(page, limit);
      }
    } catch (error) {
      console.error('Error parsing local HTML with Playwright:', error);
    } finally {
      await browser.close();
    }
    return [];
  }

  // If no local file or empty, we would fall back to live scraping (not implemented in this function yet)
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
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    const title = await page.title();
    let description = '';
    let thumbnail = '';
    let handle = '';
    let likes = '';
    let comments = '';

    // Extract Metadata based on platform
    if (url.includes('instagram.com')) {
      description =
        (await page
          .$eval('meta[property="og:description"]', (el) =>
            el.getAttribute('content'),
          )
          .catch(() => '')) || '';
      thumbnail =
        (await page
          .$eval('meta[property="og:image"]', (el) =>
            el.getAttribute('content'),
          )
          .catch(() => '')) || '';
    } else if (url.includes('tiktok.com')) {
      description =
        (await page
          .$eval('meta[name="description"]', (el) => el.getAttribute('content'))
          .catch(() => '')) || '';
      thumbnail =
        (await page
          .$eval('meta[property="og:image"]', (el) =>
            el.getAttribute('content'),
          )
          .catch(() => '')) || '';
    } else if (url.includes('youtube.com')) {
      description =
        (await page
          .$eval('meta[name="description"]', (el) => el.getAttribute('content'))
          .catch(() => '')) || '';
      thumbnail =
        (await page
          .$eval('meta[property="og:image"]', (el) =>
            el.getAttribute('content'),
          )
          .catch(() => '')) || '';
    }

    return {
      title,
      description,
      thumbnail,
      handle,
      likes,
      comments,
      url,
    };
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
