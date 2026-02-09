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
      const match =
        html.match(
          new RegExp(
            `<meta[^>]+(?:property|name)="${property}"[^>]+content="([^"]+)"`,
            'i',
          ),
        ) ||
        html.match(
          new RegExp(
            `<meta[^>]+content="([^"]+)"[^>]+(?:property|name)="${property}"`,
            'i',
          ),
        );
      return match ? match[1] : null;
    };

    const title =
      getMeta('og:title') || html.match(/<title>(.*?)<\/title>/i)?.[1];
    const description = getMeta('og:description') || getMeta('description');
    const thumbnail = getMeta('og:image');

    // Attempt to extract handle/channel name for TikTok/Instagram/YouTube
    let handle = getMeta('og:site_name');
    if (url.includes('tiktok.com')) {
      const tiktokMatch = html.match(/@([^/]+)/);
      if (tiktokMatch) handle = tiktokMatch[1];
    } else if (url.includes('instagram.com')) {
      // Instagram often blocks scraping without more complex headers/auth
    }

    return {
      title: title?.trim(),
      description: description?.trim(),
      thumbnail,
      handle: handle?.trim(),
      url,
    };
  } catch (error) {
    console.error('Scraping error:', error);
    return { url };
  }
}
