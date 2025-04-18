const express = require('express');
const next = require('next');
const path = require('path');
const fs = require('fs');

// Логирование при старте для отладки
console.log('Starting express-server.js...');
console.log('PORT from env:', process.env.PORT);

// Настройка окружения
const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 10000;

console.log(`Will bind to port: ${port}`);
console.log(`Development mode: ${dev}`);

// Создаем сервер Express сразу
const server = express();

// Добавляем обработчик статических файлов
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.static(__dirname));

// Важный эндпоинт для проверки работоспособности на Render
server.get('/health', (req, res) => {
  console.log('Health check endpoint accessed');
  res.status(200).send('OK');
});

// Отладочный эндпоинт
server.get('/debug', (req, res) => {
  console.log('Debug endpoint accessed');
  const debugInfo = {
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'not set',
    nextExists: fs.existsSync(path.join(__dirname, '.next')),
    currentDirectory: __dirname,
    files: fs.readdirSync(__dirname)
  };
  res.json(debugInfo);
});

// Резервный обработчик для всех запросов при неудачной инициализации Next.js
server.get('*', (req, res) => {
  console.log(`Request received: ${req.url}`);
  res.send('Server is starting, please wait...');
});

// Инициализация сервера ДО инициализации Next.js
// Это гарантирует, что порт будет открыт и Render его обнаружит
server.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    return;
  }
  console.log(`> Server is running on http://0.0.0.0:${port}`);
  
  // Инициализация Next.js после запуска сервера
  const app = next({ dev });
  const handle = app.getRequestHandler();

  app.prepare()
    .then(() => {
      console.log('Next.js initialized successfully');
      
      // Обновляем обработчики маршрутов после инициализации Next.js
      server._router.stack.pop(); // Удаляем временный wildcard обработчик
      
      server.all('*', (req, res) => {
        console.log(`Handling request with Next.js: ${req.url}`);
        return handle(req, res);
      });
      
      console.log('Server is now fully operational with Next.js');
    })
    .catch(err => {
      console.error('Error initializing Next.js:', err);
      // Сервер продолжит работу даже при ошибке инициализации Next.js
    });
});

// Обработка сигналов для корректного завершения
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`> Received ${signal} signal, shutting down...`);
    server.close(() => {
      console.log('> HTTP server closed');
      process.exit(0);
    });
  });
}); 