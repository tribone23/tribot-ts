import { AttachmentInfo, IWebMessageInfoExtended } from '../lib/types';
import { getTiktokVideo, getTiktokVideoV2 } from '../lib/downloader.js';
import { isValidUrl } from '../lib/urlchecker.js';
import { performance } from 'perf_hooks';
import utils from '../lib/utils.js';

async function speed(
  data: AttachmentInfo,
  senderNumber: string,
  m: IWebMessageInfoExtended,
  start: number,
) {
  await utils.sendAttachment(data, senderNumber, m);
  const end = performance.now();
  await utils.sendText(`⏱️ it tooks ${end - start} miliseconds`, senderNumber);
}

export async function tiktok2(
  url: Array<string>,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  if (url.length == 0 || url.length > 1 || !isValidUrl(url[0])) {
    utils.reply('Please provide a valid url sir', senderNumber, m);
  } else {
    const start = performance.now();
    const result = await getTiktokVideoV2(url[0]);

    if (result.success) {
      const data: AttachmentInfo = {
        type: 'video',
        url: result.result,
        caption: `✨ Direct Link: ${result.result}`,
      };
      console.log('iki url ew' + data.url);
      await speed(data, senderNumber, m, start);
    } else {
      utils.reply(result.message!, senderNumber, m);
    }

    // console.log(data)
  }
}
export async function tiktok(
  url: Array<string>,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  if (url.length == 0 || url.length > 1 || !isValidUrl(url[0])) {
    utils.reply('Please provide a valid url sir', senderNumber, m);
  } else {
    const start = performance.now();
    const result = await getTiktokVideo(url[0]);

    if (result.success) {
      const data: AttachmentInfo = {
        type: 'video',
        url: result.result?.data.url,
        caption: `✨ Direct Link: ${result.result?.data.url}`,
      };
      await speed(data, senderNumber, m, start);
    } else {
      utils.reply(result.message!, senderNumber, m);
    }

    // console.log(data)
  }
}
