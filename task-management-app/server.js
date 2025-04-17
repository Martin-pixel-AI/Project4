const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

console.log(`Starting Next.js app with NODE_ENV=${process.env.NODE_ENV}`);
console.log(`Will bind to ${hostname}:${port}`);

// Инициализируем Next.js
const app = next({ dev, dir: process.cwd() });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log('Next.js app prepared, creating HTTP server...');
  
  const server = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error handling request:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });
  
  // Явно указываем hostname при прослушивании
  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Server is ACTIVELY listening on port ${port}`);
  });
  
  // Обработка сигналов для корректного завершения
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  });
}); 