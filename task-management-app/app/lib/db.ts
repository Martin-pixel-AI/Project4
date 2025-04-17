import mongoose from 'mongoose';

// Определяем глобальный тип для кеширования соединения
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Объявляем глобальное свойство
declare global {
  var mongoose: MongooseCache | undefined;
}

// Создаем или получаем кеш
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Инициализируем глобальную переменную, если она не существует
if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectToDB(): Promise<typeof mongoose> {
  // Если у нас уже есть соединение, возвращаем его
  if (cached.conn) {
    return cached.conn;
  }

  // Если у нас ещё нет промиса соединения, создаем его
  if (!cached.promise) {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable');
    }

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    // Ожидаем установки соединения
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
} 