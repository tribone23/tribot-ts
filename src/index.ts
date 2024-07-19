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

const { proto } = Proto;

const logger = MAIN_LOGGER.child({});
logger.level = 'info';

const useStore = !process.argv.includes('--no-store');
const msgRetryCounterCache = new NodeCache();

const store = useStore ? makeInMemoryStore({ logger }) : undefined;
store?.readFromFile('auth/baileys_store_multi.json');
setInterval(() => {
  store?.writeToFile('auth/baileys_store_multi.json');
}, 10_000);

async function triBotInitialize(reconnectAttempt = 0) {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const { version } = await fetchLatestBaileysVersion();
  const maxReconnectAttempts = 5;
  const reconnectDelay = 5000;

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: true,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    generateHighQualityLinkPreview: true,
    defaultQueryTimeoutMs: undefined,
    syncFullHistory: false,
    msgRetryCounterCache,
    getMessage,
  });

  store?.bind(sock.ev);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect =
        lastDisconnect &&
        (lastDisconnect.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

      if (shouldReconnect && reconnectAttempt < maxReconnectAttempts) {
        console.log(`Reconnect attempt #${reconnectAttempt + 1}`);
        setTimeout(() => {
          triBotInitialize(reconnectAttempt + 1);
        }, reconnectDelay);
      } else {
        console.log(
          'Connection closed. You are logged out or max attempts reached.',
        );
      }
    } else if (connection === 'open') {
      console.log('Opened connection');
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

          await pollListener(payload);
        }
      }
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    for (const message of m.messages) {
      if (
        !message.message ||
        message.key.fromMe ||
        (message.key && message.key.remoteJid === 'status@broadcast')
      )
        continue;

      if (message.message.ephemeralMessage) {
        message.message = message.message.ephemeralMessage.message;
      }

      try {
        await sock.sendPresenceUpdate('composing', message.key.remoteJid!);
        await handler(message);
      } catch (error) {
        let errMsg = 'Error when updating presence';
        if (error instanceof Error) {
          errMsg = error.message;
        }
        console.log(errMsg);
      } finally {
        await sock.sendPresenceUpdate('available', message.key.remoteJid!);
      }
    }
  });

  return sock;
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

export const sock = await triBotInitialize();
