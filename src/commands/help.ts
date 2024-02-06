import utils from '../lib/utils.js'

export async function helpCommand(senderNumber: string, m: any) {
    const helpCmd = '*TRIBot* - Command List'
    let prefix = /^[\\/!#.]/gi.test(m.args[0])
        ? m.args[0].match(/^[\\/!#.]/gi)
        : '/'
    let commandList = ['help', 'ip', 'speedtest', 'test', 'shell', 'sticker']

    const usage = `*Usage*\n[prefix](command)\n\n-- _Example_ --:\n\`\`\`${prefix}${commandList[2]}\`\`\`\n`
    const text = `${helpCmd}\n\n*MAIN*\n\`\`\`${commandList}\`\`\`\n\n${usage}`
    const url = 'https://beradadisini.com/wp-content/uploads/2008/08/eve.jpg'

    utils.replyWithImages(text, url, senderNumber, m)
}
