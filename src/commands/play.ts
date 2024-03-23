import yts from 'yt-search';
import utils from '../lib/utils.js';
import { PollMessageOptions } from '@whiskeysockets/baileys';
import { IWebMessageInfoExtended } from '../lib/types.js';
import ytPlayer from '../lib/player.js';
import EventEmitter from 'node-cache';

const eventEmitter = new EventEmitter();
let waitForAnswer = false;

export async function userAnswer(answer: string) {
  // console.log(answer);
  // emit event dari jawaban e
  eventEmitter.emit('pollMessageReceived', answer);
}

export async function play(
  query: Array<string>,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  if (!waitForAnswer) {
    if (query.length > 0) {
      waitForAnswer = true;
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

      const answer = await new Promise<string>((resolve) => {
        const listener = (payload: string) => {
          resolve(payload);
          eventEmitter.off('pollMessageReceived', listener);
        };
        eventEmitter.on('pollMessageReceived', listener);
      });

      const choosen = title.indexOf(answer);
      const link = result.videos[choosen].url;
      const duration = result.videos[choosen].timestamp;

      // console.log(choosen, link, duration);
      await ytPlayer(link, senderNumber, duration, m);

      // console.log('onok event', answer);

      waitForAnswer = false;
    }
  }
}
