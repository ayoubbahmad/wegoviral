import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { callApi, cleanupTestData, createTestUser, prisma, TestUser } from './support';
import { pickLocale, translateMessage } from '../../src/lib/i18n';
import { localizeTree } from '../../src/lib/localize';

describe('languages', () => {
  let member: TestUser;
  let admin: TestUser;
  const spaceIds: string[] = [];

  before(async () => {
    [member, admin] = await Promise.all([createTestUser('i18n'), createTestUser('i18nadmin', { role: 'SUPER_ADMIN' })]);
  });

  after(async () => {
    await prisma.communitySpace.deleteMany({ where: { id: { in: spaceIds } } });
    await cleanupTestData();
  });

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

  describe('team content', () => {
    it('puts translated fields in the reader’s language and falls back to the main text', () => {
      const record = { id: 'x', name: 'Wins', description: 'Share wins', options: ['Yes', 'No'], translations: { fr: { name: 'Victoires', description: ' ', options: ['Oui', ''] } } };
      assert.deepEqual(localizeTree([{ space: record, at: new Date(0) }], 'fr'), [
        { space: { id: 'x', name: 'Victoires', description: 'Share wins', options: ['Oui', 'No'] }, at: new Date(0) },
      ]);
      assert.deepEqual(localizeTree(record, 'ar'), { id: 'x', name: 'Wins', description: 'Share wins', options: ['Yes', 'No'] });
    });

    it('serves a space in each language, and every language to the team', async () => {
      const created = await admin.call('POST', '/admin/spaces', {
        name: 'Lang test space',
        emoji: '💬',
        description: 'Main text',
        translations: { fr: { name: 'Espace test', description: 'Texte principal' }, ar: { name: 'مساحة تجريبية' } },
      });
      assert.equal(created.status, 201, JSON.stringify(created.data));
      spaceIds.push(created.data.id);
      const spaceIn = async (language?: string) =>
        (await member.call('GET', '/feed/spaces', undefined, language)).data.find((space: { id: string }) => space.id === created.data.id);

      assert.deepEqual([(await spaceIn('fr')).name, (await spaceIn('fr')).description], ['Espace test', 'Texte principal']);
      assert.deepEqual([(await spaceIn('ar')).name, (await spaceIn('ar')).description], ['مساحة تجريبية', 'Main text']);
      const english = await spaceIn();
      assert.equal(english.name, 'Lang test space');
      assert.equal('translations' in english, false, 'members don’t get the other languages');

      // A partial update leaves the translations alone; the admin list has them all
      await admin.call('PATCH', `/admin/spaces/${created.data.id}`, { description: 'New main text' }, 'fr');
      const managed = (await admin.call('GET', '/admin/spaces', undefined, 'fr')).data;
      const row = (Array.isArray(managed) ? managed : managed.spaces).find((space: { id: string }) => space.id === created.data.id);
      assert.equal(row.name, 'Lang test space');
      assert.equal(row.translations.fr.name, 'Espace test');
    });
  });
});
