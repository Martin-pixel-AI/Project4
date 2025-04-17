const express = require('express');
const next = require('next');

// Логирование при старте для отладки
console.log('Starting express-server.js...');
console.log('PORT from env:', process.env.PORT);

// Настройка окружения
const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 10000;

console.log(`Will bind to port: ${port}`);

// Создаем сервер Express сразу
const server = express();

// Важный эндпоинт для проверки работоспособности на Render
server.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Резервный обработчик для всех запросов при неудачной инициализации Next.js
server.get('*', (req, res) => {
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