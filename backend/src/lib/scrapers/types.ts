export interface ScrapedVideo {
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  views?: string | number;
  likes?: string | number;
  comments?: string | number;
  postedAt?: string;
}

export interface ScraperOptions {
  headless?: boolean;
  limit?: number;
}
