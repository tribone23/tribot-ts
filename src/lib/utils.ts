import { AnyMessageContent } from '@whiskeysockets/baileys';
import { AttachmentInfo, IWebMessageInfoExtended } from './types';
import { sock } from '../index.js';

const sendText = async (text: string, senderNumber: string): Promise<void> => {
  await sock.sendMessage(senderNumber, { text: text });
};

const sendAttachment = async (
  attachmentInfo: AttachmentInfo,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) => {
  const { type, url, caption } = attachmentInfo;

  if (type === 'video') {
    await sock.sendMessage(
      senderNumber,
      { caption: caption || 'Nyo videone', video: { url: url ?? '' } },
      { quoted: m },
    );
  } else if (type === 'image') {
    await sock.sendMessage(
      senderNumber,
      { caption: caption || 'Nyo Gambare', image: { url: url ?? '' } },
      { quoted: m },
    );
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

const utils = {
  sendText,
  sendAttachment,
  reply,
  replyWithImages,
  replyWithSticker,
};

export default utils;
