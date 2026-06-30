require("dotenv").config();

const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const qrcode = require("qrcode-terminal");

const ia = require("./comandos/ia");
const imagenes = require("./comandos/imagenes");

let economia = {};

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

  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {

    if (qr) {
      qrcode.generate(qr, { small: true });
    }

    if (connection === "open") {
      console.log("✅ AmorBot conectado correctamente.");
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

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
        console.error(err);
      }
    }
  });

  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages[0];

    if (!msg.message) return;

    const from = msg.key.remoteJid;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      "";

    console.log("MENSAJE RECIBIDO:", text);
       if (text === ".menu") {

      await sock.sendMessage(from, {
        text: `💜 *AMORBOT*

🤖 IA
• .ia
• .analisis

🖼️ Imágenes
• .pin
• .wallpaper
• .ext

⚙️ Sistema
• .ping
• .menu`
      });

      return;
    }

    if (text === ".ping") {

      await sock.sendMessage(from, {
        text: "🏓 Pong! AmorBot está activo."
      });

      return;
    }
    if (text.startsWith(".pin")) {

      let busqueda = text.replace(".pin", "").trim();

      if (!busqueda) {
        await sock.sendMessage(from, {
          text: "🖼️ Ejemplo: .pin Ferrari F40"
        });
        return;
      }

      await imagenes.pin(sock, from, busqueda);
    }

    if (text.startsWith(".wallpaper")) {

      let busqueda = text.replace(".wallpaper", "").trim();

      if (!busqueda) {
        await sock.sendMessage(from, {
          text: "🌌 Ejemplo: .wallpaper Ferrari"
        });
        return;
      }

      await imagenes.wallpaper(sock, from, busqueda);
    }

    if (text.startsWith(".ext")) {

      let busqueda = text.replace(".ext", "").trim();

      if (!busqueda) {
        await sock.sendMessage(from, {
          text: "🌌 Ejemplo: .ext anime"
        });
        return;
      }

      await imagenes.pinw(sock, from, busqueda);
    }

    if (text.startsWith(".ia")) {

      let pregunta = text.replace(".ia", "").trim();

      if (!pregunta) {
        await sock.sendMessage(from, {
          text: "🤖 Ejemplo: .ia ¿Quién es Fernando Alonso?"
        });
        return;
      }

      await ia.preguntar(sock, from, pregunta);
    }
    if (text.startsWith(".analisis")) {

      let pregunta = text.replace(".analisis", "").trim();

      if (!pregunta) {
        await sock.sendMessage(from, {
          text: "📊 Ejemplo: .analisis Ferrari gana la F1"
        });
        return;
      }

      await ia.preguntar(sock, from, pregunta);
    }

  });

}

startBot();
