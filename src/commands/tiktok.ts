import { AttachmentInfo, IWebMessageInfoExtended } from '../lib/types';
import { getTiktokVideo } from '../lib/downloader.js';
import { isValidUrl } from '../lib/urlchecker.js';
import { performance } from 'perf_hooks';

import utils from '../lib/utils.js';

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

      await utils.sendAttachment(data, senderNumber, m);
      const end = performance.now();
      await utils.sendText(
        `⏱️ it tooks ${end - start} miliseconds`,
        senderNumber,
      );
    } else {
      utils.reply(result.message!, senderNumber, m);
    }

    // console.log(data)
  }
}
