import utils from '../lib/utils.js';
import { IWebMessageInfoExtended } from '../lib/types.js';

export async function helpCommand(
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  const helpCmd = '*TRIBot* - Command List';
  const prefix = '/';
  const commandList = [
    'help',
    'ip',
    'speedtest',
    'test',
    'shell',
    'sticker',
    'tiktok',
  ];

  const usage = `*Usage*\n[prefix](command)\n\n-- _Example_ --:\n\`\`\`${prefix}${commandList[2]}\`\`\`\n`;
  const text = `${helpCmd}\n\n*MAIN*\n\`\`\`${commandList}\`\`\`\n\n${usage}`;
  const url = 'https://beradadisini.com/wp-content/uploads/2008/08/eve.jpg';

  utils.replyWithImages(text, url, senderNumber, m);
}
