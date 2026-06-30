const axios = require("axios");

module.exports = {

async enviar(sock,from,url,texto){

await sock.sendMessage(from,{
image:{url:url},
caption:texto
});

},

async imagen(sock,from,busqueda){

let url=`https://loremflickr.com/600/400/${encodeURIComponent(busqueda)}`;

await this.enviar(sock,from,url,`🖼️ ${busqueda}`);

},

async wallpaper(sock,from,busqueda){

let url=`https://loremflickr.com/1920/1080/${encodeURIComponent(busqueda)}`;

await this.enviar(sock,from,url,`🌌 ${busqueda}`);

},

async pin(sock,from,busqueda){

for(let i=1;i<=30;i++){

let url=`https://loremflickr.com/600/400/${encodeURIComponent(busqueda)}?random=${i}`;

await this.enviar(sock,from,url,`🖼️ ${busqueda} ${i}/30`);

}

},

async pinw(sock,from,busqueda){

for(let i=1;i<=30;i++){

let url=`https://loremflickr.com/1920/1080/${encodeURIComponent(busqueda)}?random=${i}`;

await this.enviar(sock,from,url,`🌌 ${busqueda} ${i}/30`);

}

}

}
