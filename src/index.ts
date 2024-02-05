import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import handler from "./lib/handler.js";

const { state, saveCreds } = await useMultiFileAuthState("auth");
const { version } = await fetchLatestBaileysVersion();

export const sock = makeWASocket({
  version,
  printQRInTerminal: true,
  auth: state,
});

async function triBotInitialize() {
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        "connection closed due to ",
        lastDisconnect?.error,
        ", reconnecting ",
        shouldReconnect
      );
      // reconnect nek gak login
      if (shouldReconnect) {
        triBotInitialize();
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (m) => {
    m.messages.forEach(async (message) => {
      if (
        !message.message ||
        message.key.fromMe ||
        (message.key && message.key.remoteJid == "status@broadcast")
      )
        return;
      if (message.message.ephemeralMessage) {
        message.message = message.message.ephemeralMessage.message;
      }

      try {
        await sock.sendPresenceUpdate("composing", message.key.remoteJid!);
        await handler(sock, message);
      } catch (error) {
        let errMsg = "Terdapat error ketika mengupdate presence";
        if (error instanceof Error) {
          errMsg = error.message;
        }
        console.log(errMsg);
      } finally {
        await sock.sendPresenceUpdate("available", message.key.remoteJid!);
      }
    });
  });
}

triBotInitialize();
