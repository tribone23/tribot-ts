import { exec } from 'child_process';
import utils from '../lib/utils.js';
import { IWebMessageInfoExtended } from '../lib/types';

export async function shell(
  cmd: Array<string>,
  senderNumber: string,
  m: IWebMessageInfoExtended,
): Promise<void> {
  if (cmd.length == 0) {
    utils.reply('Please provide the command to execute sir', senderNumber, m);
  }

  const shellexec = cmd.join(' ');
  try {
    exec(shellexec, (error, stdout, stderr) => {
      if (error) {
        utils.reply(`[ERROR] ${error.message}`, senderNumber, m);
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        utils.reply(
          `[ERROR] Shell execution failed ${stderr}`,
          senderNumber,
          m,
        );
        console.log(`stderr: ${stderr}`);
        return;
      }
      utils.reply(stdout, senderNumber, m);
    });
  } catch (error) {
    console.error(error);
    utils.reply(
      'There is an error when executing shell command',
      senderNumber,
      m,
    );
  }
}
