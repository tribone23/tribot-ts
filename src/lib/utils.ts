import { sock } from "../index.js";

const sendText = async (text: string, senderNumber: string): Promise<void> => {
  await sock.sendMessage(senderNumber, { text: text });
};

const reply = async (text: string, senderNumber: string, m: any): Promise<void> => {
  await sock.sendMessage(senderNumber, { text }, { quoted: m });
};

const replyWithImages = async (
  text: string,
  url: string,
  senderNumber: string,
  m: any
): Promise<void> => {
  await sock.sendMessage(
    senderNumber,
    { image: { url: url }, caption: text },
    { quoted: m, mediaUploadTimeoutMs: 1000 * 60 }
  );
};

const utils = {
  sendText,
  reply,
  replyWithImages,
};

export default utils;
