import { test } from 'node:test';
import assert from 'node:assert/strict';
import { matchPlatform } from '../shorts-blocker-extension/rules.js';

const blocked = {
  youtube: [
    'https://www.youtube.com/shorts/abc123',
    'https://m.youtube.com/shorts/abc123?feature=share',
    'https://www.youtube.com/@mkbhd/shorts',
  ],
  instagram: [
    'https://www.instagram.com/reel/C1abc/',
    'https://www.instagram.com/reels/',
    'https://www.instagram.com/someuser/reels/',
  ],
  facebook: [
    'https://www.facebook.com/reel/2051489205656843',
    'https://web.facebook.com/reel/123/',
    'https://www.facebook.com/reels/',
    'https://www.facebook.com/share/r/abc/',
  ],
  reddit: ['https://v.redd.it/abc123'],
  snapchat: ['https://www.snapchat.com/spotlight/abc'],
  tiktok: ['https://www.tiktok.com/@u/video/1', 'https://vm.tiktok.com/xyz/'],
  other: ['https://likee.video/', 'https://www.douyin.com/'],
};

const allowed = [
  'https://www.youtube.com/',
  'https://www.youtube.com/watch?v=abc123',
  'https://www.youtube.com/@shortsfan/videos',
  'https://www.instagram.com/p/C1abc/',
  'https://www.instagram.com/direct/inbox/',
  'https://www.facebook.com/',
  'https://www.facebook.com/watch/?v=1',
  'https://www.reddit.com/r/videos/',
  'https://i.redd.it/x.jpg',
  'https://www.snapchat.com/',
  'https://notyoutube.com/shorts/1',
  'https://youtube.com.evil.com/shorts/1',
  'chrome-extension://abc/blocked.html',
  'not a url',
];

for (const [id, urls] of Object.entries(blocked)) {
  for (const url of urls) {
    test(`blocks ${url}`, () => assert.equal(matchPlatform(url)?.id, id));
  }
}

for (const url of allowed) {
  test(`allows ${url}`, () => assert.equal(matchPlatform(url), null));
}
