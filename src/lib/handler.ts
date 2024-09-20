import fs from 'fs';
import utils from './utils.js';
import path from 'path';
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
import { facebook } from '../commands/fb.js';
import { aiModeUsers, aiChatHandler } from '../commands/ai.js';
import { play } from '../commands/play.js';
import { recapSpend, spendOut } from '../commands/spend.js';
import { chatAi, aiChatModel } from './chatAi.js';
import { model, chat, Tesco, genAI } from './chatAi.js';
import { sock } from '../index.js';

import 'dotenv/config';
// import { insertData, findData } from './mongo.js';
// import { db } from '../index.js';

export default async function (m: IWebMessageInfoExtended): Promise<void> {
  let body;
  let mentionByReply;
  let mentionByTag;
  const owner1 = process.env.OWNER1;
  const owner2 = process.env.OWNER2;
  const ownnumber = process.env.BOTNUMBER;
  const senderNumber: string = m.key.remoteJid ?? '';
  const who = m.key.participant ? m.key.participant : m.key.remoteJid;

  const isGroup = senderNumber.endsWith('@g.us');
  const groupMetadata = isGroup
    ? await sock.groupMetadata(senderNumber).catch(() => {})
    : null;
  const groupMembers =
    isGroup && groupMetadata && groupMetadata.participants
      ? groupMetadata.participants
      : [];
  const groupName =
    isGroup && groupMetadata && groupMetadata.subject
      ? groupMetadata.subject
      : [];

  /* declared tapi not used, warn eslint
  const groupDesc =
    isGroup && groupMetadata && groupMetadata.desc ? groupMetadata.desc : [];
  const groupId =
    isGroup && groupMetadata && groupMetadata.id ? groupMetadata.id : [];
  const groupOwner =
    isGroup && groupMetadata && groupMetadata.subjectOwner
      ? groupMetadata.subjectOwner
      : [];
    */

  const user =
    isGroup && groupMembers ? groupMembers.find((i) => i.id == who) : undefined;
  const bot =
    isGroup && groupMembers
      ? groupMembers.find((i) => i.id == ownnumber)
      : undefined;
  console.log(bot);
  // const bot = isGroup && groupMembers ? groupMembers.find((i) => i.id == who ) : [];
  const isSadmin =
    isGroup && user && user.admin === 'superadmin' ? true : false;
  const isAdmin = isGroup && user && user.admin === 'admin' ? true : false;
  const isBotGroupAdmins =
    (isGroup && bot && bot.admin === 'admin') ||
    (isGroup && bot && bot.admin === 'superadmin')
      ? true
      : false;

  if (m.message) {
    m.mtype = getContentType(m.message);
    mentionByTag =
      m.mtype == 'extendedTextMessage' &&
      m.message?.extendedTextMessage?.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.mentionedJid
        : [];

    mentionByReply =
      m.mtype == 'extendedTextMessage' &&
      m.message?.extendedTextMessage?.contextInfo != null
        ? m.message.extendedTextMessage.contextInfo.participant || ''
        : '';
  }

  try {
    body =
      m.mtype === 'conversation'
        ? m.message?.conversation
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
                        ? m.message?.buttonsResponseMessage?.selectedButtonId ||
                          m.message?.listResponseMessage?.singleSelectReply
                            ?.selectedRowId ||
                          m.text
                        : '';
  } catch (e) {
    console.log(e);
  }

  if (typeof body === 'string') {
    try {
      const prefixMatch = /^[\\/!#.]/gi.test(body)
        ? body.match(/^[\\/!#.]/gi)
        : '/';
      const prefix = prefixMatch instanceof Array ? prefixMatch[0] : '/';
      const trimmedBody = body.replace(prefix, '').trim();
      const words = trimmedBody.split(/ +/);

      // console.log('words ' + words);
      let command;
      if (words.length > 0) {
        command = words[0].toLowerCase();
        m.args = words.slice(1);
      } else {
        m.args = [];
      }
      const firstmess = body.startsWith(prefix);
      // console.log('prefix ' + prefix);
      // console.log('body ' + body);
      // console.log('commande ' + command);
      // console.log('firstmess ' + firstmess);

      const userState = await aiChatHandler(
        body,
        command,
        senderNumber,
        m.pushName,
        m.key.remoteJid,
        ownnumber,
      );

      await chatAi(body, command, senderNumber, m.key.remoteJid, ownnumber, m);

      /* 
      WIP - Work in Progress
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
      } */

      const q = m.args.join(' ');

      const tag =
        mentionByTag && mentionByTag.length > 0
          ? mentionByTag[0]
          : mentionByReply && mentionByReply.length > 0
            ? mentionByReply[0]
            : q + '@s.whatsapp.net';
      if (mentionByReply == ownnumber) {
        utils.reply('GA SUKA DI REPLY!!', senderNumber, m);
      }
      if (firstmess) {
        switch (command) {
          case 'p':
            // kalau debugging di local saja mas
            console.log(isAdmin, isBotGroupAdmins, isSadmin, 'true kabek kah');
            console.log('sek sek sek');
            console.log(groupMembers);
            console.log('nomer bot e', ownnumber);
            break;
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
          case 'kick':
            if (!isGroup) {
              utils.reply('minimal di group', senderNumber, m);
              break;
            } else if (!isBotGroupAdmins) {
              console.log(isBotGroupAdmins);
              utils.reply('BOT BUKAN ADMIN ', senderNumber, m);
              break;
            }
            await sock
              .groupParticipantsUpdate(senderNumber, [tag], 'remove')
              .then(() => {
                utils.reply(
                  `Mampus keluar lu ${
                    tag.split('@')[0]
                  } jauh jauh dari group ${groupName} ini`,
                  senderNumber,
                  m,
                );
              })
              .catch((err) => console.log('bjir error ' + err));
            break;
          case 'add':
            {
              console.log('tes');
              if (!isGroup) {
                utils.reply('minimal di group', senderNumber, m);
                break;
              } else if (!isBotGroupAdmins) {
                utils.reply('BOT BUKAN ADMIN ', senderNumber, m);
                break;
              }
              const jawab: string =
                `Berhasil menambahkan  ${tag.split('@')[0]} ke dalam group ${groupName}` ||
                '';
              await sock
                .groupParticipantsUpdate(senderNumber, [tag], 'add')
                .then((res) => {
                  console.log(res);
                  if (res[0].status == '200') {
                    utils.replyWithMention(senderNumber, jawab, [tag], m);
                  } else {
                    utils.reply('gagal', senderNumber, m);
                  }
                })
                .catch((err) => console.log('bjir error ' + err));
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
          case 'ytmp4':
            {
              console.log(m.args[0]);
              console.log(m.args[1]);
            }
            break;
          case 'fb':
            await facebook(m.args, senderNumber, m);
            break;
          case 'play':
            await play(m.args, senderNumber, m);
            break;
          case 'button':
            await utils.sendButtons(senderNumber, m);
            break;
          case 'keluar':
            await spendOut(m.args, who, senderNumber, m);
            break;
          case 'rekap':
            await recapSpend(m.args, who, senderNumber, m);
            break;
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
          case 'ppp':
            {
              console.log('tes');
              if (userState.aiModeEnabled === false) {
                userState.aiModeEnabled = true;
                aiChatModel.set(senderNumber, userState);
                model[senderNumber] = genAI.getGenerativeModel({
                  model: 'gemini-1.5-flash',
                });
                console.log(model);
                // Tesco();
                chat[senderNumber] = model[senderNumber]?.startChat({
                  history: [],
                });
                utils.reply('login', senderNumber, m);
              }
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
        // case 'whoami': {
        //   const data = {
        //     _id: who,
        //     nama: m.pushName,
        //     premium: false,
        //     time: new Date(),
        //   };

        //   const cek = await findData(db, 'data_user', { _id: who });

        //   if (cek && cek.length === 0) {
        //     utils.sendText('silahkan register terlebih dahulu', senderNumber);
        //     await insertData(db, 'data_user', data);
        //   }

        //   const cekString = cek?.map((item) => JSON.stringify(item)).join('\n');
        //   utils.sendText(cekString || 'No data', senderNumber);
        //   break;
        // }
      }
      ////
    } catch (err) {
      console.log(err);
    }
  }
}
