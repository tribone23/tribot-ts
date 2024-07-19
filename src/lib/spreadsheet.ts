import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { parseDateInput } from './parser.js';
import { SpendRowData } from './types';
import 'dotenv/config';

const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(
  process.env.SPREADSHEET_ID!,
  serviceAccountAuth,
);

await doc.loadInfo();

export async function credit(
  who: string,
  nominal: number,
  kategori: string,
  item: string,
) {
  const title = `Pengeluaran-${who}`;
  const sheet = doc.sheetsByTitle[title];

  if (sheet == undefined) {
    console.log('Sheet doesnt exist yet, creating new sheet');

    try {
      const date = new Date();
      const newSheet = await doc.addSheet({
        title: title,
        headerValues: ['Item', 'Kategori', 'Nominal', 'Tanggal'],
      });

      await newSheet.addRow({
        Item: item,
        Kategori: kategori,
        Nominal: nominal,
        Tanggal: date.toLocaleString(),
      });

      const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}/edit?gid=${newSheet.sheetId}#gid=${newSheet.sheetId}`;
      const result = `Berhasil membuat spreadsheet baru, berikut URL anda ${spreadsheetUrl}`;
      return result;
    } catch (e) {
      console.log(e);
      return 'Error when creating new spreadsheet';
    }
  } else {
    try {
      const date = new Date();
      await sheet.addRow({
        Item: item,
        Kategori: kategori,
        Nominal: nominal,
        Tanggal: date.toLocaleString(),
      });

      return 'Laporan pengeluaran Berhasil';
    } catch (e) {
      console.log(e);
      return 'Error when insert new credit row';
    }
  }
}

type RekapKeluar = {
  [key: string]: number;
};

export async function recap(who: string, format: string) {
  const title = `Pengeluaran-${who}`;
  const sheet = doc.sheetsByTitle[title];
  const rows = await sheet.getRows<SpendRowData>();

  const parsedInput = parseDateInput(format);
  if (!parsedInput) {
    const message =
      'Contoh:\n/rekap 2024-05-01\n/rekap 2024-05\n/rekap 2024-05-01 2024-05-05';
    return message;
  }

  const { dataRange, sumType } = parsedInput;

  const rekapKeluar: RekapKeluar = {};

  rows.forEach((row) => {
    const date = new Date(row.get('Tanggal'));
    if (date >= dataRange[0].from && date < dataRange[0].to) {
      if (sumType === 'daily') {
        const day = date.toLocaleDateString('id-ID');
        if (!rekapKeluar[day]) {
          rekapKeluar[day] = 0;
        }
        rekapKeluar[day] += Number(row.get('Nominal'));
      } else if (sumType === 'monthly') {
        const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
        if (!rekapKeluar[month]) {
          rekapKeluar[month] = 0;
        }
        rekapKeluar[month] += Number(row.get('Nominal'));
      }
    }
  });

  const rekapKeluarString = Object.entries(rekapKeluar)
    .map(([key, value]) => `${key}: Rp.${value}`)
    .join('\n');

  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${doc.spreadsheetId}/edit?gid=${sheet.sheetId}#gid=${sheet.sheetId}`;
  const result = `Pengeluaran (${sumType}): \n${rekapKeluarString}\n\nSpreadsheet: ${spreadsheetUrl}`;
  return result;
}
