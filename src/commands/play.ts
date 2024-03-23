import yts from 'yt-search';
import utils from '../lib/utils.js';
import { PollMessageOptions } from '@whiskeysockets/baileys';
import { IWebMessageInfoExtended } from '../lib/types.js';
import ytPlayer from '../lib/player.js';
import EventEmitter from 'node-cache';

const eventEmitter = new EventEmitter();
const waitForAnswer = new Map<string, boolean>();

export async function userAnswer(senderNumber: string, answer: string) {
  eventEmitter.emit(senderNumber, answer);
  // console.log(answer);
  // emit event dari jawaban e
}

export async function play(
  query: Array<string>,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  if (waitForAnswer.get(senderNumber) === undefined) {
    waitForAnswer.set(senderNumber, false);
  }

  if (waitForAnswer.get(senderNumber) === false) {
    if (query.length > 0) {
      waitForAnswer.set(senderNumber, true);
      console.log(waitForAnswer.get(senderNumber));
      const result = await yts.search(query.join(' '));
      // console.log(result);
      const title = result.videos
        .slice(0, 5)
        .map((video) => `${video.title} [${video.timestamp}]`);

      const options: PollMessageOptions = {
        name: `🗣️ Result for ${query.join(' ')}`,
        selectableCount: 1,
        values: title,
      };

      await utils.sendPoll(options, senderNumber, m);

      // // console.log(answer);
      setTimeout(() => {
        // lek user gak njawab 20 detik lanjut
        console.log('ganok');
        waitForAnswer.set(senderNumber, false);
      }, 20000);

      const answer = await new Promise<string>((resolve) => {
        const listener = (payload: string) => {
          resolve(payload);
          eventEmitter.off(senderNumber, listener);
        };
        eventEmitter.on(senderNumber, listener);
      });

      console.log("saiki kondisine", waitForAnswer.get(senderNumber));
      console.log(answer);

      const choosen = title.indexOf(answer);
      const link = result.videos[choosen].url;
      const duration = result.videos[choosen].timestamp;

      // console.log(choosen, link, duration);
      await ytPlayer(link, senderNumber, duration, m);

      // console.log('onok event', answer);

      waitForAnswer.set(senderNumber, false);
    }
  }
}
