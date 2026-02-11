import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

async function testCheerio() {
  const dumpPath = path.join(__dirname, 'scrapes/youtube_shorts.html');
  const html = fs.readFileSync(dumpPath, 'utf-8');
  console.log(`Loaded ${html.length} bytes`);

  const $ = cheerio.load(html);

  const richItems = $('ytd-rich-item-renderer').length;
  const lockupHosts = $('.shortsLockupViewModelHost').length;
  const anyShortsLink = $('a[href*="/shorts/"]').length;

  console.log('Cheerio Stats:');
  console.log('ytd-rich-item-renderer count:', richItems);
  console.log('.shortsLockupViewModelHost count:', lockupHosts);
  console.log('Shorts links count:', anyShortsLink);

  if (lockupHosts > 0) {
    const first = $('.shortsLockupViewModelHost').first();
    console.log('First Host Classes:', first.attr('class'));
    console.log('First Host Parent Tag:', first.parent().prop('tagName'));
    console.log(
      'First Title:',
      first
        .find('.shortsLockupViewModelHostMetadataTitle span[role="text"]')
        .text(),
    );
  }
}

testCheerio().catch(console.error);
