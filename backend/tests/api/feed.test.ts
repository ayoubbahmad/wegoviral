import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  cleanupTestData,
  createTestUser,
  STORAGE_UPLOAD_URL,
  TestUser,
  TINY_PNG,
  trackStorageFile,
} from './support';

describe('community feed', () => {
  let author: TestUser;
  let reader: TestUser;
  let admin: TestUser;
  let coverUrl: string;
  let postId: string;
  let pollOptionIds: string[];

  before(async () => {
    [author, reader, admin] = await Promise.all([
      createTestUser('author'),
      createTestUser('reader'),
      createTestUser('admin', { role: 'ADMIN' }),
    ]);
  });
  after(cleanupTestData);

  describe('spaces', () => {
    it('lists the seeded spaces with post counts', async () => {
      const { status, data } = await author.call('GET', '/feed/spaces');
      assert.equal(status, 200);
      assert.ok(data.length >= 12);
      assert.ok('postCount' in data[0]);
    });
  });

  describe('uploads', () => {
    it('issues a signed upload URL and the uploaded image is public', async () => {
      const { status, data } = await author.call('POST', '/feed/uploads', {
        contentType: 'image/png',
        size: TINY_PNG.length,
      });
      assert.equal(status, 201);
      trackStorageFile(data.path);
      const upload = await fetch(STORAGE_UPLOAD_URL(data.path, data.token), {
        method: 'PUT',
        headers: { 'Content-Type': 'image/png' },
        body: TINY_PNG,
      });
      assert.ok(upload.ok, `upload failed: ${upload.status}`);
      assert.ok((await fetch(data.publicUrl)).ok);
      coverUrl = data.publicUrl;
    });

    it('rejects images over 5 MB', async () => {
      const { status } = await author.call('POST', '/feed/uploads', {
        contentType: 'image/png',
        size: 6 * 1024 * 1024,
      });
      assert.equal(status, 400);
    });
  });

  describe('posts', () => {
    it('rejects members posting in admin-only spaces', async () => {
      const { status } = await author.call('POST', '/feed/posts', { spaceId: 'announcements', content: 'hi' });
      assert.equal(status, 403);
    });

    it('rejects images from outside our storage', async () => {
      const { status } = await author.call('POST', '/feed/posts', {
        spaceId: 'wins',
        content: 'x',
        coverUrl: 'https://evil.example/x.png',
      });
      assert.equal(status, 400);
    });

    it('rejects empty posts', async () => {
      const { status } = await author.call('POST', '/feed/posts', { spaceId: 'wins' });
      assert.equal(status, 400);
    });

    it('creates a post with a cover and a poll', async () => {
      const { status, data } = await author.call('POST', '/feed/posts', {
        spaceId: 'wins',
        title: 'Test win',
        content: 'Hello feed',
        coverUrl,
        pollOptions: ['Yes', 'No'],
      });
      assert.equal(status, 201);
      assert.equal(data.coverUrl, coverUrl);
      assert.equal(data.poll.options.length, 2);
      postId = data.id;
      pollOptionIds = data.poll.options.map((option: { id: string }) => option.id);
    });

    it('paginates with a cursor without duplicates', async () => {
      for (let i = 0; i < 3; i++) {
        await author.call('POST', '/feed/posts', { spaceId: 'questions', content: `paging ${i}` });
      }
      const page1 = await reader.call('GET', '/feed/posts?limit=2');
      const page2 = await reader.call('GET', `/feed/posts?limit=2&cursor=${page1.data.nextCursor}`);
      const ids = [...page1.data.posts, ...page2.data.posts].map((post: { id: string }) => post.id);
      assert.equal(new Set(ids).size, 4);
    });
  });

  describe('reactions', () => {
    it('likes are idempotent and can be undone', async () => {
      await reader.call('PUT', `/feed/posts/${postId}/like`);
      const again = await reader.call('PUT', `/feed/posts/${postId}/like`);
      assert.equal(again.data.likeCount, 1);
      const undo = await reader.call('DELETE', `/feed/posts/${postId}/like`);
      assert.deepEqual(undo.data, { likedByMe: false, likeCount: 0 });
      await reader.call('PUT', `/feed/posts/${postId}/like`);
    });

    it('bookmarks', async () => {
      const { data } = await reader.call('PUT', `/feed/posts/${postId}/bookmark`);
      assert.equal(data.bookmarkedByMe, true);
    });

    it('counts one poll vote per member', async () => {
      const first = await reader.call('POST', `/feed/posts/${postId}/vote`, { optionId: pollOptionIds[0] });
      assert.equal(first.data.poll.options[0].votes, 1);
      assert.equal(first.data.poll.votedOptionId, pollOptionIds[0]);
      const second = await reader.call('POST', `/feed/posts/${postId}/vote`, { optionId: pollOptionIds[1] });
      assert.equal(second.status, 409);
    });

    it('returns viewer state per user', async () => {
      const find = async (user: TestUser) =>
        (await user.call('GET', '/feed/posts?spaceId=wins')).data.posts.find(
          (post: { id: string }) => post.id === postId,
        );
      const asReader = await find(reader);
      assert.ok(asReader.likedByMe && asReader.bookmarkedByMe && asReader.poll.votedOptionId);
      const asAuthor = await find(author);
      assert.ok(!asAuthor.likedByMe && !asAuthor.bookmarkedByMe && !asAuthor.poll.votedOptionId);
    });
  });

  describe('comments', () => {
    let commentId: string;

    it('adds and lists comments, updating the count', async () => {
      const created = await reader.call('POST', `/feed/posts/${postId}/comments`, { content: 'Congrats!' });
      assert.equal(created.status, 201);
      commentId = created.data.id;
      const list = await author.call('GET', `/feed/posts/${postId}/comments`);
      assert.equal(list.data.length, 1);
    });

    it("doesn't let members delete other people's comments", async () => {
      const { status } = await author.call('DELETE', `/feed/comments/${commentId}`);
      assert.equal(status, 403);
    });

    it('lets staff delete any comment', async () => {
      const { status } = await admin.call('DELETE', `/feed/comments/${commentId}`);
      assert.equal(status, 204);
    });
  });

  describe('top posts', () => {
    // Real posts share this database, so check the ranking rule rather than exact positions
    it('ranks by likes + 2 × comments and leaves out posts without engagement', async () => {
      const { data } = await author.call('GET', '/feed/posts/top');
      const scores = data.map(
        (post: { likeCount: number; commentCount: number }) => post.likeCount + post.commentCount * 2,
      );
      assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
      assert.ok(scores.every((score: number) => score > 0));
    });
  });

  describe('staff powers', () => {
    it("doesn't let members pin or delete other people's posts", async () => {
      assert.equal((await author.call('PATCH', `/feed/posts/${postId}/pin`, { pinned: true })).status, 403);
      assert.equal((await reader.call('DELETE', `/feed/posts/${postId}`)).status, 403);
    });

    it('lets staff post in admin-only spaces', async () => {
      const { status } = await admin.call('POST', '/feed/posts', { spaceId: 'announcements', content: 'Team update' });
      assert.equal(status, 201);
    });

    it('lets staff pin; pinned posts come first', async () => {
      const pinned = await admin.call('PATCH', `/feed/posts/${postId}/pin`, { pinned: true });
      assert.equal(pinned.data.pinned, true);
      const { data } = await reader.call('GET', '/feed/posts?limit=1');
      assert.equal(data.posts[0].id, postId);
    });

    it('lets authors delete their own posts', async () => {
      assert.equal((await author.call('DELETE', `/feed/posts/${postId}`)).status, 204);
      const { data } = await reader.call('GET', '/feed/posts?spaceId=wins');
      assert.ok(!data.posts.some((post: { id: string }) => post.id === postId));
    });
  });
});
