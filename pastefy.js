'use strict';

const { request } = require('undici');

/**
 * Sube contenido de texto a Pastefy.app
 * @param {string} content El código o texto a subir
 * @param {string} title Título opcional para el paste
 * @returns {Promise<string>} URL del paste generado
 */
async function uploadToPastefy(content, title = 'UnveilX Deobfuscated') {
  try {
    const response = await request('https://api.pastefy.app/api/v2/paste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        content: content,
        type: 'PASTE',
        visibility: 'PUBLIC'
      })
    });

    if (response.statusCode !== 200 && response.statusCode !== 201) {
      throw new Error(`Error de API Pastefy: ${response.statusCode}`);
    }

    const data = await response.body.json();
    
    // La API de Pastefy suele devolver un ID o una URL corta
    if (data.success && data.paste && data.paste.id) {
      return `https://pastefy.app/${data.paste.id}`;
    } else {
      throw new Error('No se pudo obtener el ID del paste');
    }
  } catch (error) {
    console.error('[PASTEFY ERROR]', error.message);
    throw error;
  }
}

module.exports = { uploadToPastefy };
