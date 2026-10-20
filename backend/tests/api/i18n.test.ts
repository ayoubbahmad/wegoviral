import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { callApi, cleanupTestData, createTestUser, TestUser } from './support';
import { pickLocale, translateMessage } from '../../src/lib/i18n';

describe('languages', () => {
  let member: TestUser;

  before(async () => {
    member = await createTestUser('i18n');
  });

  after(cleanupTestData);

  describe('message translation', () => {
    it('picks a supported language from Accept-Language', () => {
      assert.equal(pickLocale('ar-MA,ar;q=0.9,fr;q=0.8'), 'ar');
      assert.equal(pickLocale('fr-FR'), 'fr');
      assert.equal(pickLocale('de-DE,es;q=0.9'), 'en');
      assert.equal(pickLocale(undefined), 'en');
    });

    it('translates exact messages, patterns and joined lock reasons', () => {
      assert.equal(translateMessage('Event not found', 'fr'), 'Événement introuvable');
      assert.equal(translateMessage('Event not found', 'ar'), 'الفعالية غير موجودة');
      assert.equal(translateMessage('Event not found', 'en'), 'Event not found');
      assert.equal(translateMessage('Unlocks in 12 days', 'fr'), 'Se débloque dans 12 jours');
      assert.equal(translateMessage('Reach Level 3 (Rising) · Unlocks in 1 day', 'fr'), 'Atteignez le niveau 3 (Rising) · Se débloque dans 1 jour');
      assert.equal(translateMessage('Pro Vault: Unlocks in 4 days', 'ar'), 'Pro Vault: يُفتح بعد 4 أيام');
      assert.equal(translateMessage('Failed to load events', 'fr'), 'Une erreur est survenue. Réessayez.');
      assert.equal(translateMessage('Some brand new message', 'ar'), 'Some brand new message', 'unknown messages stay in English');
    });
  });

  describe('API', () => {
    it('answers errors in the language the app asks for', async () => {
      const call = (language: string) =>
        fetch(`${process.env.API_URL || 'http://localhost:3001/api'}/events/not-a-real-event`, {
          headers: { 'Accept-Language': language, Authorization: '' },
        });
      // Without a token the API refuses first, in the requested language
      const fr = await (await call('fr')).json();
      assert.equal(fr.error, 'Vous n’êtes pas connecté. Connectez-vous pour continuer.');
      const en = await (await call('en-US')).json();
      assert.equal(en.error, 'You are not logged in. Please log in to get access.');
    });

    it('saves the member’s language on their profile', async () => {
      assert.equal((await member.call('GET', '/auth/me')).data.user.locale, null);
      assert.equal((await member.call('PUT', '/auth/me/locale', { locale: 'ar' })).status, 204);
      assert.equal((await member.call('GET', '/auth/me')).data.user.locale, 'ar');
      assert.equal((await member.call('PUT', '/auth/me/locale', { locale: 'de' })).status, 400);
    });

    it('translates errors for signed-in members too', async () => {
      const response = await callApi('GET', '/events/not-a-real-event', { token: undefined });
      assert.equal(response.status, 401);
      const notFound = await member.call('GET', '/events/not-a-real-event');
      assert.equal(notFound.data.error, 'Event not found', 'the test client sends no language, so English');
    });
  });
});
