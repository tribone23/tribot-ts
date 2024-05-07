import {
  downloadMediaMessage,
  getContentType,
  PollMessageOptions,
} from '@whiskeysockets/baileys';
import { IWebMessageInfoExtended } from './types.js';
import { ipaddr } from '../commands/ip.js';
import { helpCommand } from '../commands/help.js';
import { speedtest } from '../commands/speedtest.js';
import { shell } from '../commands/shell.js';
import { sticker } from '../commands/sticker.js';
import { tiktok } from '../commands/tiktok.js';
import { aiModeUsers, aiChatHandler } from '../commands/ai.js';
import { play } from '../commands/play.js';
import { sock } from '../index.js';
import fs from 'fs';
import utils from './utils.js';
import path from 'path';
import 'dotenv/config';
import { insertData, findData } from './mongo.js';
import { db } from '../index.js';
export default async function (m: IWebMessageInfoExtended): Promise<void> {
  const senderNumber: string = m.key.remoteJid ?? '';
  const groupMetadata = await sock.groupMetadata(senderNumber).catch(() => {});
  const isGroup = senderNumber.endsWith('@g.us');
  const groupMembers =
    isGroup && groupMetadata && groupMetadata.participants
      ? groupMetadata.participants
      : [];

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

      const userState = await aiChatHandler(
        body,
        command,
        senderNumber,
        m.pushName,
      );
      const who = m.key.participant ? m.key.participant : m.key.remoteJid;

      const data = {
        _id: who,
        nama: m.pushName,
        premium: false,
        time: new Date(),
      };

      const cek = await findData(db, 'data_user', { _id: who });

      if (cek && cek.length === 0) {
        utils.sendText('silahkan register terlebih dahulu', senderNumber);
        await insertData(db, 'data_user', data);
      }
      const q = m.args.join(' ');
      switch (command) {
        case 'jodohku':
          {
            const member = groupMembers.map((i) => i.id);
            console.log(member);
            const jodo = member[Math.floor(Math.random() * member.length)];
            console.log(jodo);
            const jawab = `jodo kamu adalah @${
              jodo.split('@')[0]
            }\nsegera ke KUA sukolilo ya`;
            const mentions = [jodo];
            sock.sendMessage(
              senderNumber,
              { text: jawab, mentions: mentions },
              { quoted: m },
            );
          }
          break;
        case 'hidetag':
        case 'pengumuman':
          {
            const member: Array<string> = [];
            // console.log('groupMetadata ' + typeof groupMetadata);
            // console.log('isGroup ' + typeof isGroup);
            // console.log('groupMembers ' + typeof groupMembers);
            // console.log(groupMetadata.participants);
            groupMembers.map((i) => member.push(i.id));
            sock.sendMessage(senderNumber, {
              text: q ? q : 'test',
              mentions: member,
            });
          }
          break;
        case 'help':
          await helpCommand(senderNumber, m);
          break;
        case 'p':
          console.log(m.args);
          break;
        case 'ip':
          await ipaddr(senderNumber);
          break;
        case 'forward': {
          const q: string = m.args.join(' ');
          utils.sendForward(senderNumber, q, true);
          break;
        }
        case 'forward1': {
          const q: string = m.args.join(' ');
          utils.sendForward(senderNumber, q, false);
          break;
        }
        case 'test':
          utils.sendText(`testo testo dari ${m.pushName}`, senderNumber);
          break;
        case 'speedtest':
          utils.sendText('Performing server speedtest...', senderNumber);
          await speedtest(senderNumber, m);
          break;
        case 'sh':
        case 'shell':
          if (who === owner1 || who === owner2) {
            await shell(m.args, senderNumber, m);
          } else {
            const filePath = path.resolve('./src/assets/dikira_lucu.jpg');
            const media = fs.readFileSync(filePath);
            const vn: string =
              'https://bucin-livid.vercel.app/audio/lusiapa.mp3';
            await utils.sendAudio(senderNumber, vn, m);
            await sticker(senderNumber, media, m);
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
        case 'tt':
        case 'tiktok':
          await tiktok(m.args, senderNumber, m);
          break;
        case 'play':
          await play(m.args, senderNumber, m);
          break;
        case 'button':
          await utils.sendButtons(senderNumber, m);
          break;
        case 'whoami': {
          const cekString = cek?.map((item) => JSON.stringify(item)).join('\n');
          utils.sendText(cekString || 'No data', senderNumber);
          break;
        }
        case 'poll':
          console.log(m);
          if (m.args.length > 0) {
            const options: PollMessageOptions = {
              name: m.args.join(' '),
              selectableCount: 1,
              values: ['Waduh', 'Wadah', 'Waduhh'],
            };
            utils.sendPoll(options, senderNumber, m);
          } else {
            utils.sendText(
              'Please provide a question for the poll.',
              senderNumber,
            );
          }

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
