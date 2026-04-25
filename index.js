'use strict';

const {
  Client,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  AttachmentBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const { request } = require('undici');
const http = require('http');
// Importamos deobfuscate y pastefy según tu segundo código
const { deobfuscate } = require('./deobfuscator'); 
const { uploadToPastefy } = require('./pastefy');

// Configuración de entorno
const TOKEN = process.env.DISCORD_TOKEN || process.env.DISCORD_BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const PREFIX = '.l';

// --- SERVIDOR WEB PARA RAILWAY ---
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('UnveilX Deobfuscator is Online\n');
}).listen(PORT, () => {
  console.log(`[WEB] Servidor de salud activo en puerto ${PORT}`);
});

if (!TOKEN) {
  console.error('[FATAL] No se encontró el TOKEN en las variables de entorno.');
  process.exit(1);
}

// Cliente con los intents necesarios para leer mensajes
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
  partials: [Partials.Channel, Partials.Message]
});

// Colores para los embeds
const GREEN = 0x2ecc71;
const RED = 0xe74c3c;

// Funciones de utilidad
async function fetchUrlContent(url) {
  const res = await request(url, { maxRedirections: 5 });
  if (res.statusCode < 200 || res.statusCode >= 300) {
    throw new Error(`HTTP ${res.statusCode} al obtener la URL`);
  }
  return await res.body.text();
}

client.once('ready', () => {
  console.log(`[BOT] Sesión iniciada como ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignorar bots y mensajes que no empiecen con el prefijo
  if (message.author.bot || !message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  // Comando principal: .l deobf o .l (si quieres que funcione directo)
  if (command === 'deobf' || command === 'unveil') {
    let sourceCode = '';

    try {
      // 1. Verificar archivos adjuntos
      if (message.attachments.size > 0) {
        const file = message.attachments.first();
        sourceCode = await fetchUrlContent(file.url);
      } 
      // 2. Verificar si hay link o código directo
      else if (args.length > 0) {
        const input = args.join(' ');
        if (/^https?:\/\//i.test(input)) {
          sourceCode = await fetchUrlContent(input);
        } else {
          // Limpiar bloques de código markdown si existen
          sourceCode = input.replace(/^
http://googleusercontent.com/immersive_entry_chip/0

### Cambios principales realizados:
1.  **Eliminado el comando `/obf`**: Se quitó toda la lógica de los Slash Commands del primer código.
2.  **Sistema de Prefijos**: Ahora usa `.l deobf` (puedes cambiarlo en la constante `PREFIX`).
3.  **Lógica de Entrada**: El bot ahora detecta automáticamente si le pasas un archivo adjunto, un link de GitHub/Pastebin o código pegado directamente.
4.  **Integración**: He unido la función `deobfuscate` y el servidor de salud (Health Check) necesario para que servicios como Railway no marquen la app como caída.
5.  **Limpieza de Markdown**: Si el usuario pega código dentro de bloques `` ```lua ... ``` ``, el bot lo limpia automáticamente antes de procesarlo.

**Nota:** Asegúrate de tener los archivos `deobfuscator.js` y `pastefy.js` en la misma carpeta que este archivo principal.

