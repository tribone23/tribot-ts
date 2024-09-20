import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import 'dotenv/config';
import utils from './utils.js';
import { UserState } from './types.js';
import { IWebMessageInfoExtended } from './types.js';

export const genAI = new GoogleGenerativeAI(`${process.env.GEMINI}`);
export const model: any = {};
export const aiChatModel = new Map<string, UserState>();
export const chat: any = {};

// export const Tesco = (model: { [key: string]: any }, sender: string): void => {
//   console.log(model[sender]);
// };

const result: any = {};
export const chatAi = async (
  body: string,
  command: string | undefined,
  senderNumber: string,
  remoteJid: string | null | undefined,
  ownnumber: string | undefined,
  m: IWebMessageInfoExtended,
) => {
  const ownJid = ownnumber + '@s.whatsapp.net' || remoteJid;
  const userStateCommand = aiChatModel.get(senderNumber) ?? {
    aiModeEnabled: false,
  };
  // chat[senderNumber] = model?[senderNumber]?.startChat({
  //   history: [],
  // });
  console.log(senderNumber);
  if (userStateCommand.aiModeEnabled) {
    console.log('tessssssssh');

    switch (command) {
      case 'ikilo':
        {
          console.log(model);
          console.log(JSON.stringify(chat[senderNumber].params?.history));
        }
        break;
      case 'exit':
        userStateCommand.aiModeEnabled = false; // Disable AI mode for user
        aiChatModel.set(senderNumber, userStateCommand);
        utils.sendText('Keluar dari mode AI.', senderNumber);
        break;

      default:
        result[senderNumber] = await chat[senderNumber].sendMessage(body);
        utils.sendText(result[senderNumber].response.text(), senderNumber);
        console.log(JSON.stringify(chat[senderNumber].params?.history));
        break;
    }
    console.log(userStateCommand);
    return userStateCommand;
  }
};
