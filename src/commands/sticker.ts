import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { makeid } from "../lib/makeid.js";
import utils from "../lib/utils.js";

export async function sticker(
  senderNumber: string,
  image: any,
  m: any
) {
  try {
    const sticker = new Sticker(image, {
      pack: "TRIBot",
      author: "Sticker Maker by TRIBot",
      type: StickerTypes.FULL,
      categories: ["🎉"],
      id: makeid(5),
      quality: 50,
      background: "#FFFFFF00",
    });

    await utils.replyWithSticker(await sticker.toMessage(), senderNumber, m);
  } catch (error) {
    let errMsg = "[ERROR] There is an error when generate sticker";
    if (error instanceof Error) {
      errMsg = error.message;
    }
    await utils.reply(errMsg, senderNumber, m);
  }
}
