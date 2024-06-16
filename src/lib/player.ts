import { getYoutubeVideo } from './downloader.js';
// import ytdl from 'ytdl-core';
import utils from './utils.js';
import { IWebMessageInfoExtended, AttachmentInfo } from './types.js';

export default async function ytPlayer(
  url: string,
  senderNumber: string,
  duration: string,
  m: IWebMessageInfoExtended,
) {
  try {
   // const info = await ytdl.getInfo(url);
    //const format = ytdl.chooseFormat(info.formats, { quality: 'lowestaudio' });
    // console.log(format.url);
    const start = performance.now();
    const result = await getYoutubeVideo(url);

    if (result.success) {
      const data: AttachmentInfo = {
        type: 'audio',
        url: result.result?.data.url,
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

    // const data: AttachmentInfo = {
    //   type: 'audio',
    //   url: format.url,
    // };

    //  const thumbnail = info.videoDetails.thumbnails[0].url;

    // utils.replyWithImages(
    //   `✨ Now playing ${info.videoDetails.title}\n🕐 ${duration}`,
    //   thumbnail,
    //   senderNumber,
    //   m,
    // );

  } catch (error) {
    console.error(error);
    utils.reply(
      'An error occured while processing your request',
      senderNumber,
      m,
    );
  }
}
