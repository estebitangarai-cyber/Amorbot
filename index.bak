const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" }),
    printQRInTerminal: false
  });

  sock.ev.on("creds.update", saveCreds);

  let pairingRequested = false;

  sock.ev.on("connection.update", async ({ connection, lastDisconnect }) => {

    if (connection === "open") {
      console.log("✅ AmorBot conectado correctamente.");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log("🔄 Reconectando...");

      if (shouldReconnect) {
        startBot();
      }
    }

    if (!pairingRequested && !state.creds.registered) {
      pairingRequested = true;

      try {
        const code = await sock.requestPairingCode("573178104554");
        console.log("\n💜 Código de vinculación:");
        console.log(code);
      } catch (err) {
        console.error("❌ Error al solicitar el código:");
        console.error(err);
      }
    }
  });
}

startBot();
