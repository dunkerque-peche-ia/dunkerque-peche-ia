const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Charge les variables d'environnement depuis le fichier .env
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) process.env[match[1]] = match[2].trim();
    });
  }
} catch (e) {
  console.log("Erreur lors de la lecture du fichier .env :", e.message);
}

const PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  
  // --- DEBUT DU PROXY API (GEMINI) ---
  if (urlPath === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);
        const userMessage = parsedBody.message;
        
        const apiUrl = process.env.API_URL;
        const apiKey = process.env.API_KEY;

        if (!apiUrl || !apiKey) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Configuration manquante dans le .env' }));
        }

        const externalUrl = new URL(apiUrl);
        externalUrl.searchParams.append('key', apiKey);

        const geminiPayload = JSON.stringify({
          contents: [{ parts: [{ text: userMessage }] }]
        });

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(geminiPayload)
          }
        };

        const proxyReq = https.request(externalUrl, options, (proxyRes) => {
          let responseData = '';
          proxyRes.on('data', (chunk) => { responseData += chunk; });
          proxyRes.on('end', () => {
            res.writeHead(proxyRes.statusCode, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            try {
              const data = JSON.parse(responseData);
              if(data.candidates && data.candidates.length > 0) {
                 res.end(JSON.stringify({ reply: data.candidates[0].content.parts[0].text }));
              } else {
                 res.end(JSON.stringify({ error: "Pas de réponse de l'IA", details: data }));
              }
            } catch(e) {
              res.end(responseData);
            }
          });
        });

        proxyReq.on('error', (e) => {
          console.error("Erreur avec l'API Gemini:", e);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Erreur proxy: ' + e.message }));
        });

        proxyReq.write(geminiPayload);
        proxyReq.end();
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Requete invalide' }));
      }
    });
    return;
  }
  // --- FIN DU PROXY API ---

  let filePath = path.join(__dirname, urlPath === '/' ? 'index.html' : urlPath);
  const ext = path.extname(filePath).toLowerCase();
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error: ' + err.code);
      }
    } else {
      res.writeHead(200, { 
        'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
