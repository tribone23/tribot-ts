import utils from '../lib/utils.js';
import { IWebMessageInfoExtended } from '../lib/types.js';
import moment from 'moment-timezone';
async function sapaan() {
  const time: number = moment.tz('Asia/Jakarta').format('HH');
  let salam: string;
  if (time <= 10 && time >= 3) {
    return (salam = ' *selamat pagi kakak* ');
  } else if (time <= 14) {
    return (salam = ' *selamat siang kakak* ');
  } else if (time <= 17) {
    return (salam = ' *selamat sore kakak* ');
  } else if (time <= 23) {
    return (salam = ' *selamat malam kakak* ');
  } else {
    return (salam = ' *kok belum tidur?* ');
  }
}
export async function helpCommand(
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  const helpCmd = '*TRIBot* - Command List';
  const prefix = '/';
  const salam = await sapaan();
  const commandList = [
    'help',
    'ip',
    'speedtest',
    'test',
    'shell',
    'sticker',
    'tiktok',
    'aimode',
  ];

  const usage = `\n*Usage*\n[prefix](command)\n\n-- _Example_ --:\n\`\`\`${prefix}${commandList[2]}\`\`\`\n`;
  const text = `${salam}\n\n${helpCmd}\n\n*MAIN*\n\`\`\`${commandList}\`\`\`\n\n${usage}`;
  const url = 'https://beradadisini.com/wp-content/uploads/2008/08/eve.jpg';

  utils.replyWithImages(text, url, senderNumber, m);
}
