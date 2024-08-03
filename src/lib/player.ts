import { getYoutubeAudio } from './downloader.js';
import { sock } from '../index.js';
import utils from './utils.js';
import { IWebMessageInfoExtended } from './types.js';

type YoutubeAudioData = {
  type: string;
  data: Buffer;
};

export default async function ytPlayer(
  url: string,
  senderNumber: string,
  duration: string,
  m: IWebMessageInfoExtended,
) {
  try {
    // const start = performance.now();
    const result = await getYoutubeAudio(url);
    console.log('hasil e', result);
    if (result?.success && result.result?.data?.result) {
      const data: YoutubeAudioData = {
        type: 'audio',
        data: result.result.data.result,
      };

      // await utils.sendAttachment(data, senderNumber, m);
      // const end = performance.now();
      await sock.sendMessage(
        senderNumber,
        { audio: data.data, mimetype: 'audio/mp4' },
        // can send mp3, mp4, & ogg
      );
    } else {
      utils.reply('gagal', senderNumber, m);
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
