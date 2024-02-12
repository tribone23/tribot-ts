import p from 'phin';
import utils from '../lib/utils.js';

interface IpAddrResult {
  ip: string;
}

export async function ipaddr(senderNumber: string): Promise<void> {
  try {
    const res = await p({
      url: 'https://api.myip.com',
      parse: 'json',
    });

    const bodyResponse = res.body as IpAddrResult;

    await utils.sendText(
      `🏓 Server IP Address\n \`\`\`${bodyResponse.ip}\`\`\``,
      senderNumber,
    );
  } catch (e) {
    console.log(e);
  }
}
