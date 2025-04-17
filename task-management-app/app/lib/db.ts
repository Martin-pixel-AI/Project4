import { MongoClient } from 'mongodb';

// Переменная для хранения экземпляра подключения
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

// Получаем URI подключения из переменных окружения
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable'
  );
}

// Функция для подключения к MongoDB
export async function connectToDatabase() {
  // Если у нас уже есть подключение, возвращаем его
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Создаем новое подключение
  const client = new MongoClient(uri!);
  await client.connect();
  
  // Извлекаем имя базы данных из URI
  const dbName = new URL(uri!).pathname.substring(1);
  const db = client.db(dbName);

  // Кэшируем подключение
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Типы данных для коллекций
export interface ProjectDocument {
  _id: string;
  name: string;
  description?: string;
  color?: string;
  tasks: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskDocument {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date;
  assignee?: string;
  projectIds: string[];
  userId: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
} 