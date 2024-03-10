import { UserState } from '../lib/types.js';
import { ApiResponseAi, checkCharId, chatWithAi } from '../lib/ai.js';
import utils from '../lib/utils.js';

export const aiModeUsers = new Map<string, UserState>();

export async function aiChatHandler(
  body: string,
  command: string | undefined,
  senderNumber: string,
) {
  const userState = aiModeUsers.get(senderNumber) ?? {
    aiModeEnabled: false,
  };

  if (userState.aiModeEnabled) {
    switch (command) {
      case 'exit':
        userState.aiModeEnabled = false; // Disable AI mode for user
        aiModeUsers.set(senderNumber, userState);
        utils.sendText('Keluar dari mode AI.', senderNumber);
        break;
      case 'reset':
        userState.characterId = undefined;
        userState.aiModeEnabled = false;
        aiModeUsers.set(senderNumber, userState);
        utils.sendText(
          'Character ID berhasil di reset, keluar dari mode AI..\n\n',
          senderNumber,
        );
        break;

      default:
        if (userState.characterId) {
          const userMessage = body;
          const characterResponse: ApiResponseAi = await chatWithAi(
            userState.characterId,
            userMessage,
          );
          if (characterResponse[0].status == 'success') {
            utils.sendText(characterResponse[0].body, senderNumber);
          }
        } else {
          const characterId = body;
          const characterStatus: ApiResponseAi = await checkCharId(characterId);
          if (characterStatus[0].status == 'success') {
            userState.characterId = characterId;
            aiModeUsers.set(senderNumber, userState);
            utils.sendText(
              `ID Character berhasil tersimpan, session started with *${characterStatus[0].body}*\n\n[-] \`\`\`/reset /exit\`\`\`\n`,
              senderNumber,
            );
          } else {
            utils.sendText(
              `Gagal membuat sesi chat, masukkan kembali Character ID yang benar\n\n[ERR] \`\`\`/exit\`\`\`\nuntuk keluar dari mode AI\n`,
              senderNumber,
            );
          }
        }
        break;
    }
  }

  return userState;
}
