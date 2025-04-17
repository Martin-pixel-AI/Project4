const express = require('express');
const next = require('next');

// Настройка окружения
const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 10000;

// Инициализация Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Добавляем эндпоинт здоровья для мониторинга Render
  server.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // Обработка всех остальных запросов через Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Запуск сервера на всех интерфейсах (0.0.0.0)
  server.listen(port, '0.0.0.0', (err) => {
    if (err) throw err;
    console.log(`> Сервер запущен на http://0.0.0.0:${port}`);
    console.log(`> Режим: ${dev ? 'разработка' : 'продакшн'}`);
    console.log(`> Переменная PORT: ${process.env.PORT || 'не указана, используется значение по умолчанию'}`);
  });

  // Обработка сигналов для корректного завершения
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      console.log(`> Получен сигнал ${signal}, завершаем работу...`);
      server.close(() => {
        console.log('> Сервер остановлен');
        process.exit(0);
      });
    });
  });
}); 