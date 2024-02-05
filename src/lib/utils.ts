import { sock } from "../index.js";

const sendText = async (text: string, senderNumber: string): Promise<void> => {
  await sock.sendMessage(senderNumber, { text: text });
};

const utils = {
  sendText,
};

export default utils;
