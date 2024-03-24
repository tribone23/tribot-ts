import { AnyMessageContent, PollMessageOptions } from '@whiskeysockets/baileys';
import { AttachmentInfo, IWebMessageInfoExtended } from './types';
import { sock } from '../index.js';

const sendText = async (text: string, senderNumber: string): Promise<void> => {
  await sock.sendMessage(senderNumber, { text: text });
};

const sendLink = async (text: string, senderNumber: string): Promise<void> => {
  await sock.sendMessage(senderNumber, {
    text: text,
    contextInfo: {
      externalAdReply: {
        title: `24 Maret 2024`,
        body: `© tribot-ts @tribone23`,
        renderLargerThumbnail: true,
        thumbnailUrl:
          'https://raw.githubusercontent.com/tribone23/tribot-ts/dev/src/assets/thumbnail.png',
        sourceUrl: 'https://github.com/tribone23',
      },
    },
  });
};

const sendAttachment = async (
  attachmentInfo: AttachmentInfo,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) => {
  const { type, url, caption, mimetype } = attachmentInfo;
  console.log(url, caption, type);

  if (type === 'video') {
    await sock.sendMessage(
      senderNumber,
      { caption: caption || 'Nyo videone', video: { url: url ?? '' } },
      { quoted: m },
    );
  } else if (type === 'image') {
    await sock.sendMessage(senderNumber, {
      caption: caption || 'Nyo Gambare',
      image: { url: url ?? '' },
    });
  } else if (type === 'audio') {
    await sock.sendMessage(senderNumber, {
      audio: { url: url ?? '' },
      mimetype: mimetype ?? 'audio/mp4',
    });
  } else {
    console.log('kapan kapan');
  }
};

const reply = async (
  text: string,
  senderNumber: string,
  m: IWebMessageInfoExtended,
): Promise<void> => {
  await sock.sendMessage(senderNumber, { text }, { quoted: m });
};

const replyWithSticker = async (
  sticker: AnyMessageContent,
  senderNumber: string,
  m: IWebMessageInfoExtended,
): Promise<void> => {
  await sock.sendMessage(senderNumber, sticker, {
    quoted: m,
  });
};

const replyWithImages = async (
  text: string,
  url: string,
  senderNumber: string,
  m: IWebMessageInfoExtended,
): Promise<void> => {
  await sock.sendMessage(
    senderNumber,
    { image: { url: url ?? '' }, caption: text },
    { quoted: m, mediaUploadTimeoutMs: 1000 * 60 },
  );
};

const sendPoll = async (
  poll: PollMessageOptions,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) => {
  await sock.sendMessage(senderNumber, { poll }, { quoted: m });
};

const sendButtons = async (
  senderNumber: string,
  m: IWebMessageInfoExtended,
) => {
  const buttons = [
    { buttonId: 'id1', buttonText: { displayText: 'Info 1!' } },
    { buttonId: 'id2', buttonText: { displayText: 'Info 2!' } },
    { buttonId: 'id3', buttonText: { displayText: '💵 Info 3' } },
  ];

  const buttonInfo = {
    text: 'Info Warung Kopi',
    buttons: buttons,
    viewOnce: true,
    headerType: 1,
  };
  await sock.sendMessage(senderNumber, buttonInfo, { quoted: m });
};

const sendAudio = async (
  senderNumber: string,
  url: string,
  m: IWebMessageInfoExtended,
  mimetype?: string,
): Promise<void> => {
  await sock.sendMessage(
    senderNumber,
    {
      audio: { url: url ?? '' },
      mimetype: mimetype ?? 'audio/mp4',
      caption: 'Nyo audione',
    },
    { quoted: m },
  );
};

const utils = {
  sendText,
  sendLink,
  sendAttachment,
  reply,
  replyWithImages,
  replyWithSticker,
  sendPoll,
  sendButtons,
  sendAudio,
};

export default utils;
