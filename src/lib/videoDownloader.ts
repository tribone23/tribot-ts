import { downloadVideo } from './youtubedownloader.js';
import { IWebMessageInfoExtended, AttachmentInfo } from './types.js';
import utils from './utils.js';
import fs from 'fs';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const videoDownloader = async (
  url: string,
  resolusi: string,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) => {
  try {
    utils.reply('proses', senderNumber, m);
    const start = performance.now();
    let videoYoutube;
    if (resolusi) {
      const resolusiVideo: string[] =
        resolusi === '480'
          ? ['135']
          : resolusi === '720'
            ? ['302', '136', '247']
            : resolusi === '1080'
              ? ['303', '248']
              : resolusi === '360'
                ? ['134']
                : ['160'];
      videoYoutube = await downloadVideo(url, resolusiVideo);
      if (videoYoutube.path) {
        console.log(videoYoutube.path);
        const result: AttachmentInfo = {
          type: 'video',
          url: videoYoutube.path,
          caption: 'Minggir lu miskin',
        };
        //   await delay(10000);
        const end = performance.now();
        await utils.sendAttachment(result, senderNumber, m);
        await utils.sendText(
          `⏱️ it tooks ${end - start} miliseconds`,
          senderNumber,
        );
        fs.unlinkSync(videoYoutube.path);
      }
    } else {
      //   utils.reply(videoYoutube.message!, senderNumber, m);
      utils.reply('Gunakan resolusi yang lain', senderNumber, m);
    }
  } catch (error) {
    console.error('error videoDowloader' + error);
  }
};
