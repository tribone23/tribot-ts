import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  getAggregateVotesInPollMessage,
  makeInMemoryStore,
  makeCacheableSignalKeyStore,
  WAMessageKey,
  WAMessageContent,
} from '@whiskeysockets/baileys';
import Proto from '@whiskeysockets/baileys/WAProto/index.js';
import { Boom } from '@hapi/boom';
import NodeCache from 'node-cache';
import pollListener from './lib/listener.js';
import handler from './lib/handler.js';
import MAIN_LOGGER from './utils/logger.js';
// import EventEmitter from 'events';
const { proto } = Proto;

// import MAIN_LOGGER from '@whiskeysockets/baileys/lib/Utils/logger.js';
// export const eventEmitter = new EventEmitter();
const logger = MAIN_LOGGER.child({});
logger.level = 'info';

const useStore = !process.argv.includes('--no-store');
const msgRetryCounterCache = new NodeCache();

const store = useStore ? makeInMemoryStore({ logger }) : undefined;
store?.readFromFile('auth/baileys_store_multi.json');
setInterval(() => {
  store?.writeToFile('auth/baileys_store_multi.json');
}, 10_000);

const { state, saveCreds } = await useMultiFileAuthState('auth');
const { version } = await fetchLatestBaileysVersion();

export const sock = makeWASocket({
  version,
  logger,
  printQRInTerminal: true,
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, logger),
  },
  generateHighQualityLinkPreview: true,
  msgRetryCounterCache,
  getMessage,
});

store?.bind(sock.ev);

async function triBotInitialize() {
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        'connection closed due to ',
        lastDisconnect?.error,
        ', reconnecting ',
        shouldReconnect,
      );
      // reconnect nek gak login
      if (shouldReconnect) {
        triBotInitialize();
      }
    } else if (connection === 'open') {
      console.log('opened connection');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.update', async (m) => {
    for (const { key, update } of m) {
      if (update.pollUpdates) {
        const pollCreation = await getMessage(key);
        if (pollCreation) {
          const pollMessage = await getAggregateVotesInPollMessage({
            message: pollCreation,
            pollUpdates: update.pollUpdates,
          });

          const payload = {
            body:
              pollMessage.find((poll) => poll.voters.length > 0)?.name || '',
            from: key.remoteJid!,
            voters: pollCreation,
            type: 'poll',
          };

          //  console.log('Emitting pollMessageReceived event with payload:', payload);
          //  eventEmitter.emit('pollMessageReceived', payload);

          await pollListener(key.remoteJid!, payload);
          // console.log(payload);
        }
      }
    }
  });

  // sock.ev.process(
  //   // events is a map for event name => event data
  //   async (events) => {
  //     if (events['messages.update']) {
  //       console.log(JSON.stringify(events['messages.update'], undefined, 2));

  //       for (const { key, update } of events['messages.update']) {
  //         if (update.pollUpdates) {
  //           console.log(
  //             'onnokkkkk poll update',
  //             update.pollUpdates,
  //             'dan keyyyyy',
  //             key,
  //           );
  //           const pollCreation = await getMessage(key);
  //           console.log('pollll nggawe', pollCreation);
  //           if (pollCreation) {
  //             console.log(
  //               'got poll update, aggregation: ',
  //               getAggregateVotesInPollMessage({
  //                 message: pollCreation,
  //                 pollUpdates: update.pollUpdates,
  //               }),
  //             );
  //           }
  //         }
  //       }
  //     }
  //   },
  // );

  sock.ev.on('messages.upsert', async (m) => {
    m.messages.forEach(async (message) => {
      if (
        !message.message ||
        message.key.fromMe ||
        (message.key && message.key.remoteJid == 'status@broadcast')
      )
        return;

      if (message.message.ephemeralMessage) {
        message.message = message.message.ephemeralMessage.message;
      }

      try {
        await sock.sendPresenceUpdate('composing', message.key.remoteJid!);
        await handler(message);
      } catch (error) {
        let errMsg = 'Terdapat error ketika mengupdate presence';
        if (error instanceof Error) {
          errMsg = error.message;
        }
        console.log(errMsg);
      } finally {
        await sock.sendPresenceUpdate('available', message.key.remoteJid!);
      }
    });
  });
}

async function getMessage(
  key: WAMessageKey,
): Promise<WAMessageContent | undefined> {
  if (store) {
    const msg = await store.loadMessage(key.remoteJid!, key.id!);
    return msg?.message || undefined;
  }

  return proto.Message.fromObject({});
}

triBotInitialize();
