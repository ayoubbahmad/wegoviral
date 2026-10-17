import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { callApi, cleanupTestData, createTestUser, TestUser } from './support';

describe('auth', () => {
  let user: TestUser;

  before(async () => {
    user = await createTestUser('auth');
  });
  after(cleanupTestData);

  it('rejects requests without a token', async () => {
    const { status } = await callApi('GET', '/auth/me');
    assert.equal(status, 401);
  });

  it('rejects forged tokens', async () => {
    const { status } = await callApi('GET', '/auth/me', { token: 'abc.def.ghi' });
    assert.equal(status, 401);
  });

  it('creates a MEMBER profile on first login with the chosen username', async () => {
    const { status, data } = await user.call('GET', '/auth/me');
    assert.equal(status, 200);
    assert.equal(data.user.role, 'MEMBER');
    assert.match(data.user.username, /^t_auth/);
    assert.equal(data.user.name, 'Test auth');
  });

  it('returns the same profile on later requests', async () => {
    const { data } = await user.call('GET', '/auth/me');
    assert.equal(data.user.id, user.profileId);
  });

  it('reports taken and invalid usernames', async () => {
    const { data: me } = await user.call('GET', '/auth/me');
    const taken = await callApi('GET', `/auth/username-available?username=${me.user.username}`);
    assert.equal(taken.data.available, false);
    const invalid = await callApi('GET', '/auth/username-available?username=No!');
    assert.equal(invalid.data.available, false);
  });
});
