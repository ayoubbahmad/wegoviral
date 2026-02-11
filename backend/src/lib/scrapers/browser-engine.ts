import { chromium } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, Page } from 'playwright';

chromium.use(StealthPlugin());

export class BrowserEngine {
  private static instance: BrowserEngine;
  private browser: Browser | null = null;

  private constructor() {}

  static getInstance(): BrowserEngine {
    if (!BrowserEngine.instance) {
      BrowserEngine.instance = new BrowserEngine();
    }
    return BrowserEngine.instance;
  }

  async getBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-blink-features=AutomationControlled',
        ],
      });
    }
    return this.browser;
  }

  async createPage(): Promise<Page> {
    const browser = await this.getBrowser();
    return await browser.newPage();
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const browserEngine = BrowserEngine.getInstance();
