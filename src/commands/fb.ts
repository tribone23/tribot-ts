import { AttachmentInfo, IWebMessageInfoExtended } from '../lib/types';
import { getFacebookVideo } from '../lib/downloader.js';
import { performance } from 'perf_hooks';

import utils from '../lib/utils.js';

export async function facebook(
  url: Array<string>,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  if (url.length == 0 || url.length > 1) {
    utils.reply('Please provide a valid URL', senderNumber, m);
  } else {
    const start = performance.now();
    const result = await getFacebookVideo(url[0]);

    if (result.success) {
      const data: AttachmentInfo = {
        type: 'video',
        url: result.result?.sd,
        caption: `" ${result.result?.title} "`,
      };

      await utils.sendAttachment(data, senderNumber, m);
      const end = performance.now();
      await utils.sendText(
        `⏱️ ${end - start} ms`,
        senderNumber,
      );
    } else {
      utils.reply(result.message!, senderNumber, m);
    }
  }
}
