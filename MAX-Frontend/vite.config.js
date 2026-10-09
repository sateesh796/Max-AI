import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import https from 'node:https';

function ttsProxyPlugin() {
  return {
    name: 'tts-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const text = urlObj.searchParams.get('text') || '';
          const lang = urlObj.searchParams.get('lang') || 'en';

          if (!text) {
            res.statusCode = 400;
            res.end('Missing text parameter');
            return;
          }

          // Split text into chunks < 160 characters to fit TTS limits
          const sentences = text.match(/[^.!?।;,\n]+[.!?।;,\n]?/g) || [text];
          const chunks = [];
          let currentChunk = '';
          for (const s of sentences) {
            if ((currentChunk + ' ' + s).length > 150) {
              if (currentChunk) chunks.push(currentChunk.trim());
              currentChunk = s;
            } else {
              currentChunk += (currentChunk ? ' ' : '') + s;
            }
          }
          if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
          }

          const fetchChunkAudio = (chunkText) => {
            return new Promise((resolve, reject) => {
              const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunkText)}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
              https.get(
                ttsUrl,
                {
                  headers: {
                    'User-Agent':
                      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    Accept: '*/*'
                  }
                },
                (proxyRes) => {
                  const data = [];
                  proxyRes.on('data', (d) => data.push(d));
                  proxyRes.on('end', () => resolve(Buffer.concat(data)));
                }
              ).on('error', reject);
            });
          };

          const audioBuffers = await Promise.all(chunks.map(fetchChunkAudio));
          const mergedBuffer = Buffer.concat(audioBuffers);

          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Content-Length', mergedBuffer.length);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(mergedBuffer);
        } catch (e) {
          res.statusCode = 500;
          res.end(e.message);
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ttsProxyPlugin()],
  server: {
    port: 3000,
    host: true
  }
});
