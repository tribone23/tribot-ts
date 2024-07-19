import { proto, WAMessageContent } from '@whiskeysockets/baileys';

export interface IWebMessageInfoExtended extends proto.IWebMessageInfo {
  mtype?: string;
  text?: string;
  args?: Array<string>;
}

export interface AttachmentInfo {
  type: 'video' | 'image' | 'audio';
  url?: string;
  caption?: string;
  mimetype?: string;
}

export interface UserState {
  aiModeEnabled: boolean;
  characterId?: string;
}

export interface PollMessage {
  body: string;
  from: string;
  voters: WAMessageContent;
  type: string;
}

export interface SpendRowData {
  Item: string;
  Kategori: string;
  Nominal: number;
  Tanggal: string;
}
