import { exec } from 'child_process'
import utils from '../lib/utils.js'

export async function speedtest(senderNumber: string, m: any): Promise<void> {
    try {
        exec('speedtest-cli', (error, stdout, stderr) => {
            if (error) {
                utils.reply(`[ERROR] ${error.message}`, senderNumber, m)
                console.log(`error: ${error.message}`)
                return
            }
            if (stderr) {
                utils.reply(
                    `[ERROR] Shell execution failed ${stderr}`,
                    senderNumber,
                    m
                )
                console.log(`stderr: ${stderr}`)
                return
            }
            utils.reply(stdout, senderNumber, m)
        })
    } catch (error) {
        console.error(error)
        utils.reply(
            'There is an error when performing speedtest',
            senderNumber,
            m
        )
    }
}
