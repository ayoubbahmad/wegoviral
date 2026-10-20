import { NextFunction, Request, Response } from 'express';
import { Locale, pickLocale, translateMessage } from '../lib/i18n';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      locale: Locale;
    }
  }
}

/** Reads the app's language from Accept-Language and translates error messages on the way out. */
export function localeMiddleware(req: Request, res: Response, next: NextFunction) {
  req.locale = pickLocale(req.headers['accept-language']);
  if (req.locale !== 'en') {
    const json = res.json.bind(res);
    res.json = (body: unknown) => {
      if (body && typeof body === 'object' && typeof (body as { error?: unknown }).error === 'string') {
        const { error } = body as { error: string };
        return json({ ...body, error: translateMessage(error, req.locale) });
      }
      return json(body);
    };
  }
  next();
}
