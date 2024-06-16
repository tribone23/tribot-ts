import { PollMessage } from './types';
import { userAnswer } from '../commands/play.js';
// import { eventEmitter } from '../index.js';

// export default async function pollListener() {
//   eventEmitter.on('pollMessageReceived', async (payload: PollMessage) => {
//     console.log('Received pollMessageReceived event with payload:', payload);
//     if (payload.body) {
//       return payload.body;
//     }
//   });
// }

// eventEmitter.on('pollMessageReceived', async (payload: PollMessage) => {
//   console.log('Received pollMessageReceived event with payload:', payload);
//   if (payload.body) {
//     return payload.body;
//   }
// });

export default async function pollListener(payload: PollMessage) {
  if (payload.body) {
    await userAnswer(payload.body);
  }
}
