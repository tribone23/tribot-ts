import { ipaddr } from "../commands/ip.js";
import utils from "./utils.js";

export default async function processMessage(
  sock: any,
  message: any
): Promise<void> {
  const senderNumber: string = message.key.remoteJid;
  const textMessage: string =
    message.message.conversation ||
    (message.message.extendedTextMessage &&
      message.message.extendedTextMessage.text) ||
    (message.message.imageMessage && message.message.imageMessage.caption) ||
    (message.message.videoMessage && message.message.videoMessage.caption);

  if (textMessage === "hola") {
    utils.sendText("iayyayaya", senderNumber);
  }

  if (textMessage === "ip") {
    ipaddr(senderNumber);
  }
}
