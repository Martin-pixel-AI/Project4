const express = require('express');
const app = express();
const port = 3000;

// Отправляем простую HTML-страницу
app.get('/', (req, res) => {
  console.log('Запрос получен на главную страницу');
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Тестовый сервер</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          background-color: #f0f0f0;
        }
        .container {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Тестовый сервер работает!</h1>
        <p>Сервер успешно запущен на порту ${port}</p>
        <p>Текущее время сервера: ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `);
});

// Запускаем сервер
app.listen(port, '0.0.0.0', () => {
  console.log(`Тестовый сервер запущен и доступен по адресу http://localhost:${port}`);
}); 