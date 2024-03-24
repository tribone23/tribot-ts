import { IWebMessageInfoExtended } from '../lib/types.js';
import utils from '../lib/utils.js';

export async function helpCommand(
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  const helpCmd = '*TRI-bot* - Staging version';
  const prefix = '/';
  const commandList = [
    'help',
    'ip',
    'speedtest',
    'test',
    'shell',
    'sticker',
    'tiktok',
    'aimode',
    'play',
  ];

  const thumbnail =
    'https://cdn.jsdelivr.net/gh/tribone23/tribot-ts@dev/src/assets/tribot.jpg';
  const sourceurl = 'https://chat.whatsapp.com/EFMNbJdOL5UIY3aj4UXWVl';
  const usage = `*Usage*\n[prefix](command)\n\n-- _Example_ --:\n\`\`\`${prefix}${commandList[2]}\`\`\`\n`;
  const text = `Hello, ${m.pushName}! 🔖\nWhat can i do for you today?\n\n${helpCmd}\n\n*Commands List*\n\`\`\`${commandList}\`\`\`\n\n${usage}\n\n\`\`\`Developed by tribone23\`\`\`\n`;

  utils.sendLink(text, senderNumber, thumbnail, sourceurl);
}
