import ytdl from 'ytdl-core';
import utils from './utils.js';
import { IWebMessageInfoExtended, AttachmentInfo } from './types.js';

export default async function ytPlayer(
  url: string,
  senderNumber: string,
  duration: string,
  m: IWebMessageInfoExtended,
) {
  try {
    const info = await ytdl.getInfo(url);
    const format = ytdl.chooseFormat(info.formats, { quality: 'lowestaudio' });
    // console.log(format.url);

    const data: AttachmentInfo = {
      type: 'audio',
      url: format.url,
    };

    const thumbnail = info.videoDetails.thumbnails[0].url;
    console.log(data);

    utils.sendAudio(senderNumber, format.url, m);
    // utils.sendAttachment(data, senderNumber, m);
    utils.replyWithImages(
      `✨ Now playing ${info.videoDetails.title}\n🕐 ${duration}`,
      thumbnail,
      senderNumber,
      m,
    );
  } catch (error) {
    console.error(error);
    utils.reply(
      'An error occured while processing your request',
      senderNumber,
      m,
    );
  }
}
