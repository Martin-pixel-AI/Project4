# Task Management App

Приложение для управления задачами, основанное на Next.js с аутентификацией и MongoDB.

## Настройка проекта

1. Установите зависимости:
```bash
npm install
```

2. Создайте `.env.local` файл в директории `task-management-app` с следующими переменными:
```
MONGODB_URI=ваш_mongodb_uri
NEXTAUTH_SECRET=ваш_секретный_ключ
NEXTAUTH_URL=http://localhost:3000
```

3. Запустите проект в режиме разработки:
```bash
npm run dev
```

## Деплой на Render

Для деплоя на Render необходимо:

1. Добавить переменные окружения в настройках сервиса:
   - `MONGODB_URI` - URI для подключения к MongoDB
   - `NEXTAUTH_SECRET` - секретный ключ для NextAuth
   - `NEXTAUTH_URL` - URL вашего сервиса (автоматически настроен в render.yaml)

2. Настройки для деплоя уже заданы в `render.yaml` и корневом `package.json`.

## Структура проекта

```
task-management-app/
  ├── app/
  │   ├── (auth)/          # Маршруты аутентификации
  │   ├── api/             # API маршруты
  │   ├── components/      # UI компоненты
  │   ├── dashboard/       # Дашборд
  │   ├── lib/             # Утилиты и библиотеки
  │   ├── models/          # Модели данных
  │   └── store/           # State management
``` 