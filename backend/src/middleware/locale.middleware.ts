import { NextFunction, Request, Response } from 'express';
import { Locale, pickLocale, translateMessage } from '../lib/i18n';
import { localizeTree, runWithLocale } from '../lib/localize';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      locale: Locale;
    }
  }
}

/** Team tools edit every language, so they get content as stored (with its translations). */
const wantsAllLanguages = (req: Request) =>
  req.originalUrl.startsWith('/api/admin') || req.originalUrl.startsWith('/api/help/manage') || req.query.raw === '1';

/**
 * Reads the app's language from Accept-Language. On the way out, error messages are translated and
 * team-written content (anything with a `translations` field) is put in that language.
 */
export function localeMiddleware(req: Request, res: Response, next: NextFunction) {
  req.locale = pickLocale(req.headers['accept-language']);
  const json = res.json.bind(res);
  res.json = (body: unknown) => {
    let out = wantsAllLanguages(req) ? body : localizeTree(body, req.locale);
    if (req.locale !== 'en' && out && typeof out === 'object' && typeof (out as { error?: unknown }).error === 'string') {
      const { error } = out as { error: string };
      out = { ...out, error: translateMessage(error, req.locale) };
    }
    return json(out);
  };
  runWithLocale(req.locale, next);
}
