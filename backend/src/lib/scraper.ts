import axios from 'axios';

export interface ScrapedMetadata {
  title?: string;
  description?: string;
  thumbnail?: string;
  handle?: string;
  url: string;
}

export async function scrapeUrl(url: string): Promise<ScrapedMetadata> {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 5000,
    });

    const getMeta = (property: string) => {
      // Improved regex to handle:
      // 1. Single or double quotes: ['"]
      // 2. Attribute order (content before property or vice-versa)
      // 3. property or name attributes
      // 4. Case insensitivity
      const metaRegex = new RegExp(
        `<meta[^>]+(?:property|name)=['"]${property}['"][^>]+content=['"]([^'"]+)['"]`,
        'i',
      );
      const contentFirstRegex = new RegExp(
        `<meta[^>]+content=['"]([^'"]+)['"][^>]+(?:property|name)=['"]${property}['"]`,
        'i',
      );

      const match = html.match(metaRegex) || html.match(contentFirstRegex);
      return match ? match[1] : null;
    };

    const title =
      getMeta('og:title') ||
      getMeta('twitter:title') ||
      html.match(/<title>(.*?)<\/title>/i)?.[1];

    const description =
      getMeta('og:description') ||
      getMeta('description') ||
      getMeta('twitter:description');

    const thumbnail =
      getMeta('og:image') || getMeta('twitter:image') || getMeta('thumbnail');

    // Attempt to extract handle/channel name for TikTok/Instagram/YouTube
    let handle = getMeta('og:site_name');

    if (url.includes('tiktok.com')) {
      const tiktokMatch = html.match(/@([^/"\s?]+)/);
      if (tiktokMatch) handle = tiktokMatch[1];
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const ytMatch =
        html.match(/"author":"([^"]+)"/) ||
        html.match(/<link[^>]+itemprop="name"[^>]+content="([^"]+)"/);
      if (ytMatch) handle = ytMatch[1];
    } else if (url.includes('instagram.com')) {
      // Instagram usually needs a real browser, but we can try site_name
      handle = handle || 'Instagram';
    }

    const result = {
      title: title?.trim(),
      description: description?.trim(),
      thumbnail,
      handle: handle?.trim(),
      url,
    };

    console.log('Scraped metadata:', result);
    return result;
  } catch (error: any) {
    console.error('Scraping error for URL:', url, error.message);
    return { url };
  }
}
