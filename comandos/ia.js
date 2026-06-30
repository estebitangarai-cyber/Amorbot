const axios = require("axios");

module.exports = {

async preguntar(sock, from, pregunta){

try{

const res = await axios.post(
"https://openrouter.ai/api/v1/chat/completions",
{
model: "openrouter/free",
messages: [
{
role: "system",
content: `Eres AmorBot experto en análisis deportivo.

Responde siempre en español.

Si es un análisis usa:

📊 ANÁLISIS AMORBOT

🏁 Evento:
📈 Probabilidad:
✅ Factores a favor:
⚠️ Factores en contra:
🏆 Conclusión:

Analiza F1, MotoGP, fútbol, NBA, UFC, tenis y más deportes.`
},
{
role: "user",
content: pregunta
}
]
},
{
headers:{
Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
"Content-Type":"application/json"
}
}
);

await sock.sendMessage(from,{
text:`🤖 ${res.data.choices[0].message.content}`
});

}catch(err){

console.log(err.response?.data || err.message);

await sock.sendMessage(from,{
text:"❌ Error al conectar con la IA."
});

}

}

};
