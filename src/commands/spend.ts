import { IWebMessageInfoExtended } from '../lib/types';
import { credit, recap } from '../lib/spreadsheet.js';
import utils from '../lib/utils.js';

export async function spendOut(
  format: Array<string>,
  who: string | null | undefined,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  if (isNaN(parseInt(format[0]))) {
    utils.reply(
      `Format: /keluar <nominal> <kategori> <item>\nContoh: \`\`\`/keluar 5000 makan bakso\`\`\` `,
      senderNumber,
      m,
    );
  } else if (format.length < 2) {
    utils.reply(
      `Format: /keluar <nominal> <kategori> <item>\nContoh: \`\`\`/keluar 5000 makan bakso\`\`\` `,
      senderNumber,
      m,
    );
  } else {
    const nominal = parseInt(format[0]);
    const kategori = format[1];
    const item = format.slice(2).join(' ');

    const result = await credit(
      who ? who : senderNumber,
      nominal,
      kategori,
      item,
    );
    utils.reply(result, senderNumber, m);
  }
}

export async function recapSpend(
  format: Array<string>,
  who: string | null | undefined,
  senderNumber: string,
  m: IWebMessageInfoExtended,
) {
  if (format.length < 1) {
    utils.reply(
      'Contoh:\n/rekap 2024-05-01\n/rekap 2024-05\n/rekap 2024-05-01 2024-05-05',
      senderNumber,
      m,
    );
  } else {
    const result = await recap(who ? who : senderNumber, format.join(' '));
    utils.reply(result, senderNumber, m);
  }
}
