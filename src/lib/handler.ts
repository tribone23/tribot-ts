import { downloadMediaMessage, getContentType } from '@whiskeysockets/baileys';
import { IWebMessageInfoExtended } from './types.js';
import { ipaddr } from '../commands/ip.js';
import { helpCommand } from '../commands/help.js';
import { speedtest } from '../commands/speedtest.js';
import { shell } from '../commands/shell.js';
import { sticker } from '../commands/sticker.js';
import { tiktok } from '../commands/tiktok.js';
import { aiModeUsers, aiChatHandler } from '../commands/ai.js';
import utils from './utils.js';
import 'dotenv/config'

export default async function (m: IWebMessageInfoExtended): Promise<void> {
  const senderNumber: string = m.key.remoteJid ?? '';
  let body;
const owner1 = process.env.OWNER1;
  const owner2 = process.env.OWNER2;
  if (m.message) {
    m.mtype = getContentType(m.message);

    try {
      body =
        m.mtype === 'conversation'
          ? m.message.conversation
          : m.mtype == 'imageMessage'
            ? m.message?.imageMessage?.caption
            : m.mtype == 'videoMessage'
              ? m.message?.videoMessage?.caption ||
                m.message?.extendedTextMessage?.contextInfo?.quotedMessage
                  ?.videoMessage
              : m.mtype == 'extendedTextMessage'
                ? m.message?.extendedTextMessage?.text ||
                  m.message?.extendedTextMessage?.contextInfo?.quotedMessage
                    ?.conversation
                : m.mtype == 'ephemeralMessage'
                  ? m.message?.ephemeralMessage?.message?.extendedTextMessage
                      ?.text
                  : m.mtype == 'buttonsResponseMessage'
                    ? m.message?.buttonsResponseMessage?.selectedButtonId
                    : m.mtype == 'listResponseMessage'
                      ? m.message?.listResponseMessage?.singleSelectReply
                          ?.selectedRowId
                      : m.mtype == 'templateButtonReplyMessage'
                        ? m.message?.templateButtonReplyMessage?.selectedId
                        : m.mtype === 'messageContextInfo'
                          ? m.message.buttonsResponseMessage
                              ?.selectedButtonId ||
                            m.message?.listResponseMessage?.singleSelectReply
                              ?.selectedRowId ||
                            m.text
                          : '';
    } catch (e) {
      console.log(e);
    }
  }

  if (typeof body === 'string') {
    try {
      const prefixMatch = /^[\\/!#.]/gi.test(body)
        ? body.match(/^[\\/!#.]/gi)
        : '/';
      const prefix = prefixMatch instanceof Array ? prefixMatch[0] : '/';
      const trimmedBody = body.replace(prefix, '').trim();
      const words = trimmedBody.split(/ +/);
      let command;

      if (words.length > 0) {
        command = words[0].toLowerCase();
        m.args = words.slice(1);
      } else {
        m.args = [];
      }

      const userState = await aiChatHandler(body, command, senderNumber, m.pushName);
      const who = m.key.participant ? m.key.participant : m.key.remoteJid;
      switch (command) {
        case 'help':
          await helpCommand(senderNumber, m);
          break;
        case 'p':
          console.log(m.args);
          break;
        case 'ip':
          await ipaddr(senderNumber);
          break;
        case 'test':
          utils.sendText(`testo testo dari ${m.pushName}`, senderNumber);
          break;
        case 'speedtest':
          utils.sendText('Performing server speedtest...', senderNumber);
          await speedtest(senderNumber, m);
          break;
        case 'sh':
        case 'shell':
          if (who !== owner1 || who !== owner2) {
            utils.sendText("gabole ☺️", senderNumber);
          } else {
          await shell(m.args, senderNumber, m);
          }
          break;
        case 's':
        case 'sticker': {
          const media = await downloadMediaMessage(m, 'buffer', {});
          if (media instanceof Buffer) {
            await sticker(senderNumber, media, m);
          } else {
            console.error('Downloaded media is not a Buffer.');
          }
          break;
        }
        case 'tiktok':
          await tiktok(m.args, senderNumber, m);
          break;
        case 'aimode': {
          userState.aiModeEnabled = true;
          aiModeUsers.set(senderNumber, userState);

          if (userState.characterId) {
            utils.sendText(
              `Memasuki mode AI dengan Character ID tersimpan *${userState.characterId}*\n\n[-] \`\`\`/reset /exit\`\`\`\n`,
              senderNumber,
            );
          } else {
            utils.sendText(
              'Memasuki mode AI, silahkan masukkan ID Character..',
              senderNumber,
            );
          }
          break;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}
