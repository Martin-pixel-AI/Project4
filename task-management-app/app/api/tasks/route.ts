import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

// Получение всех задач пользователя
export async function GET(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { db } = await connectToDatabase();
    
    // Получаем задачи пользователя
    const tasks = await db
      .collection('tasks')
      .find({ userId: session.user.email }) // Используем email как идентификатор пользователя
      .sort({ updatedAt: -1 }) // Сортируем по дате обновления
      .toArray();
    
    // Преобразуем _id в id для фронтенда
    const formattedTasks = tasks.map(task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee,
      projectIds: task.projectIds || [],
      isCompleted: task.isCompleted,
      tags: task.tags || [],
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    }));
    
    return NextResponse.json(formattedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// Создание новой задачи
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
    if (!data.title) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Преобразуем строку даты в объект Date, если она есть
    let dueDate = data.dueDate;
    if (dueDate && typeof dueDate === 'string') {
      dueDate = new Date(dueDate);
    }
    
    // Создаем объект задачи
    const now = new Date();
    const task = {
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: dueDate,
      assignee: data.assignee || session.user.email,
      projectIds: Array.isArray(data.projectIds) ? data.projectIds : [],
      isCompleted: data.isCompleted || false,
      tags: Array.isArray(data.tags) ? data.tags : [],
      userId: session.user.email,
      createdAt: now,
      updatedAt: now
    };
    
    // Сохраняем задачу в базе данных
    const result = await db.collection('tasks').insertOne(task);
    
    // Если задача привязана к проектам, обновляем эти проекты
    if (task.projectIds.length > 0) {
      for (const projectId of task.projectIds) {
        try {
          const project = await db.collection('projects').findOne({
            _id: new ObjectId(projectId),
            userId: session.user.email
          });

          if (project) {
            const tasks = project.tasks || [];
            if (!tasks.includes(result.insertedId.toString())) {
              await db.collection('projects').updateOne(
                { _id: new ObjectId(projectId) },
                { $set: { 
                  tasks: [...tasks, result.insertedId.toString()],
                  updatedAt: now 
                }}
              );
            }
          }
        } catch (error) {
          console.error(`Error updating project ${projectId}:`, error);
          // Продолжаем работу даже при ошибке обновления проекта
        }
      }
    }
    
    // Возвращаем созданную задачу с id
    return NextResponse.json({
      id: result.insertedId.toString(),
      ...task
    });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
} 