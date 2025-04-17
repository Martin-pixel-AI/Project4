import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

// MongoDB проект интерфейс
interface ProjectDocument {
  _id: ObjectId;
  name: string;
  description: string;
  color: string;
  tasks?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

// Получение всех проектов пользователя
export async function GET(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { db } = await connectToDatabase();
    
    // Получаем проекты пользователя
    const projects = await db
      .collection('projects')
      .find({ userId: session.user.email }) // Используем email как идентификатор пользователя
      .sort({ updatedAt: -1 }) // Сортируем по дате обновления
      .toArray();
    
    // Преобразуем _id в id для фронтенда
    const formattedProjects = projects.map((project: ProjectDocument) => ({
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      color: project.color,
      tasks: project.tasks || [],
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    }));
    
    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// Создание нового проекта
export async function POST(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Получаем данные из запроса
    const data = await req.json();
    
    // Проверяем обязательные поля
    if (!data.name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Создаем объект проекта
    const now = new Date();
    const project = {
      name: data.name,
      description: data.description || '',
      color: data.color || 'blue',
      tasks: [],
      userId: session.user.email,
      createdAt: now,
      updatedAt: now
    };
    
    // Сохраняем проект в базе данных
    const result = await db.collection('projects').insertOne(project);
    
    // Возвращаем созданный проект с id
    return NextResponse.json({
      id: result.insertedId.toString(),
      ...project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 