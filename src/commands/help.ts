import utils from '../lib/utils.js';
// import { getUrlInfo } from '@whiskeysockets/baileys';
//import { IWebMessageInfoExtended } from '../lib/types.js';
// import { sock } from '../index.js';

export async function helpCommand(senderNumber: string) {
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

  const url = 'https://tribone.my.id';
  const usage = `*Usage*\n[prefix](command)\n\n-- _Example_ --:\n\`\`\`${prefix}${commandList[2]}\`\`\`\n`;
  const text = `Welcome, folks! 🔖\nWhat can i do for you today?\n\n${helpCmd}\n\n*Commands List*\n\`\`\`${commandList}\`\`\`\n\n${usage}\n\n\`\`\`Development by tribone23\`\`\`\n${url}`;

  // const linkPreview = await getUrlInfo('https://github.com', {
  //   thumbnailWidth: 1024,
  //   fetchOpts: {
  //     timeout: 5000,
  //   },
  //   uploadImage: sock.waUploadToServer,
  // });
  // console.log(linkPreview)

  utils.sendLink(text, senderNumber);
}
