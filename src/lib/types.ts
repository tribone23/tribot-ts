import { proto } from '@whiskeysockets/baileys';

export interface IWebMessageInfoExtended extends proto.IWebMessageInfo {
  mtype?: string;
  text?: string;
  args?: Array<string>;
}

export interface AttachmentInfo {
  type: 'video' | 'image' | 'audio';
  url?: string;
  caption?: string;
}

export interface UserState {
  aiModeEnabled: boolean;
  characterId?: string;
}
