import { UserState } from '../lib/types.js';
import {
  ApiResponseAi,
  checkCharId,
  getCharImage,
  chatWithAi,
  getBufferFromUrl,
} from '../lib/ai.js';
import { sock } from '../index.js';
import utils from '../lib/utils.js';
import 'dotenv/config';

export const aiModeUsers = new Map<string, UserState>();

export async function aiChatHandler(
  body: string,
  command: string | undefined,
  senderNumber: string,
  senderName: string | null | undefined,
  remoteJid: string | null | undefined,
  ownnumber: string | undefined,
) {
  const ownJid = ownnumber || remoteJid;
  const userState = aiModeUsers.get(senderNumber) ?? {
    aiModeEnabled: false,
  };

  if (userState.aiModeEnabled && body.length > 0) {
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
          const userMessage = `${senderName}: ${body}`;
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

            const characterImage: ApiResponseAi =
              await getCharImage(characterId);

            if (characterImage[0].status == 'success') {
              try {
                await sock.updateProfileName(characterStatus[0].body);
                const imageUrl = `https://characterai.io/i/400/static/avatars/${characterImage[0].body}`;

                await sock.updateProfilePicture(
                  ownJid as string,
                  await getBufferFromUrl(imageUrl),
                );
              } catch (e) {
                console.log(
                  '[x] Failed to set profile info for AI character, ignoring...\n',
                  e,
                );
              }
            }
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
