const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion
} = require("@whiskeysockets/baileys");

const P = require("pino");

async function startBot() {

  const { state, saveCreds } =
    await useMultiFileAuthState("./auth_info");

  const { version } =
    await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: P({ level: "silent" })
  });

  sock.ev.on("creds.update", saveCreds);

  let pairing = false;

  sock.ev.on("connection.update", async ({ connection }) => {

    if (connection === "open") {
      console.log("💜 AmorBot conectado correctamente.");
    }

    if (
      connection === "connecting" &&
      !state.creds.registered &&
      !pairing
    ) {

      pairing = true;

      setTimeout(async () => {
        try {
          const code =
          await sock.requestPairingCode("573178104554");

          console.log("💜 Código de vinculación:");
          console.log(code);

        } catch (e) {
          console.log("❌ Error creando código");
        }
      }, 5000);
    }

  });


  sock.ev.on("messages.upsert", async ({ messages }) => {

    const msg = messages[0];

    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const text = msg.message.conversation || "";


    if (text === ".menu") {

  await sock.sendMessage(from,{
    text:
`💜 *AMORBOT V1*

🎮 *JUEGOS*
🎲 .dado
🪙 .moneda
✂️ .ppt
🧂 .salometro
🎱 .8ball
🔢 .numero
🎰 .slot
💣 .ruletarusa
❤️ .ship

🤖 Más juegos próximamente...`
  });

}


    if (text === ".dado") {

      await sock.sendMessage(from,{
        text:
        `🎲 Salió: ${Math.floor(Math.random()*6)+1}`
      });

    }


    if (text === ".moneda") {

      await sock.sendMessage(from,{
        text:
        `🪙 ${Math.random()>0.5 ? "Cara" : "Cruz"}`
      });

    }


    if (text === ".ppt") {

      let opciones = [
        "Piedra 🪨",
        "Papel 📄",
        "Tijera ✂️"
      ];

      await sock.sendMessage(from,{
        text:
        `🎮 Bot: ${opciones[Math.floor(Math.random()*3)]}`
      });

    }if (text.startsWith(".8ball")) {

const respuestas = [
"Sí.",
"No.",
"Tal vez.",
"Definitivamente.",
"No cuentes con ello.",
"Pregunta más tarde.",
"Sin duda.",
"Muy probable."
];

await sock.sendMessage(from,{
text:`🎱 ${respuestas[Math.floor(Math.random()*respuestas.length)]}`
});

}if (text === ".numero") {

await sock.sendMessage(from,{
text:`🍀 Tu número de la suerte es *${Math.floor(Math.random()*100)+1}*`
});

}if (text === ".slot") {

const emojis=["🍒","🍋","🍇","💎","7️⃣"];

const a=emojis[Math.floor(Math.random()*5)];
const b=emojis[Math.floor(Math.random()*5)];
const c=emojis[Math.floor(Math.random()*5)];

let r="😢 Perdiste.";

if(a===b&&b===c){
r="🎉 ¡JACKPOT!";
}

await sock.sendMessage(from,{
text:`🎰 ${a} | ${b} | ${c}\n\n${r}`
});

}if(text===".ruletarusa"){

const vivo=Math.random()>0.16;

await sock.sendMessage(from,{
text:vivo?
"😅 Click... sobreviviste."
:
"💥 BANG... perdiste."
});

}if (text === ".salometro") {

  const porcentaje = Math.floor(Math.random() * 101);
  const sal = Math.floor(Math.random() * 10001);

  let nivel = "";

  if (porcentaje <= 20) {
    nivel = "🍀 Casi no tienes sal.";
  } else if (porcentaje <= 40) {
    nivel = "🙂 Un poco de sal.";
  } else if (porcentaje <= 60) {
    nivel = "🧂 Ya estás salado.";
  } else if (porcentaje <= 80) {
    nivel = "🌵 Nivel de sal muy alto.";
  } else {
    nivel = "💀 ¡SAL MÁXIMA! Hoy todo te sale al revés.";
  }

  await sock.sendMessage(from, {
    text:
`🧂 *SALÓMETRO*

📊 Porcentaje de sal: ${porcentaje}%
🧂 Sal acumulada: ${sal} g

${nivel}`
  });

}if (text.startsWith(".ship")) {

  const porcentaje = Math.floor(Math.random() * 101);

  let mensaje = "";

  if (porcentaje <= 20) {
    mensaje = "💔 Mejor queden como amigos.";
  } else if (porcentaje <= 50) {
    mensaje = "😊 Hay posibilidades.";
  } else if (porcentaje <= 80) {
    mensaje = "💕 Hacen bonita pareja.";
  } else {
    mensaje = "💍 ¡Alisten la boda!";
  }

  await sock.sendMessage(from, {
    text: `❤️ *SHIP* ❤️

💖 Compatibilidad: *${porcentaje}%*

${mensaje}`
  });

}

  });

}

startBot();
