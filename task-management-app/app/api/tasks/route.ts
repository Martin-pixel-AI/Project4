import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

// Интерфейсы для типизации
interface TaskDocument {
  _id: ObjectId;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date | null;
  assignee?: string | null;
  projectIds: string[];
  userId: string;
  isCompleted: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: Date | null;
  assignee?: string | null;
  projectIds: string[];
  isCompleted: boolean;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Получение всех задач пользователя
export async function GET(req: NextRequest) {
  try {
    // Проверяем авторизацию
    const session = await getServerSession();
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Если это демо-пользователь, возвращаем демо-задачи
    if (session.user.isDemoUser) {
      console.log('Returning demo tasks for demo user');
      return NextResponse.json(getDemoTasks());
    }
    
    const { db } = await connectToDatabase();
    
    // Определяем пользовательский идентификатор
    const userId = session.user.email || 'anonymous';
    
    // Получаем задачи пользователя
    const tasks = await db
      .collection('tasks')
      .find({ userId }) // Фильтруем по ID пользователя
      .sort({ updatedAt: -1 }) // Сортируем по дате обновления
      .toArray();
    
    // Преобразуем _id в id для фронтенда
    const formattedTasks = tasks.map((task: TaskDocument): Task => ({
      id: task._id.toString(),
      title: task.title,
      description: task.description || '',
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
    
    // Если это демо-пользователь, имитируем создание задачи
    if (session.user.isDemoUser) {
      const data = await req.json();
      const demoTask: Task = {
        id: `demo-task-${Date.now()}`,
        title: data.title,
        description: data.description || '',
        status: data.status || 'todo',
        priority: data.priority || 'medium',
        dueDate: data.dueDate || null,
        assignee: data.assignee || null,
        projectIds: data.projectIds || [],
        isCompleted: false,
        tags: data.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      return NextResponse.json(demoTask);
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
    
    // Определяем пользовательский идентификатор
    const userId = session.user.email || 'anonymous';
    
    // Создаем объект задачи
    const now = new Date();
    const task = {
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      dueDate: data.dueDate || null,
      assignee: data.assignee || null,
      projectIds: data.projectIds || [],
      isCompleted: false,
      tags: data.tags || [],
      userId: userId,
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
            userId: userId
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

// Функция для получения демо-задач
function getDemoTasks(): Task[] {
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  const threeDays = 3 * oneDay;
  
  // Демо-задачи
  return [
    {
      id: 'demo-task-1',
      title: 'Создать дизайн главной страницы',
      description: 'Разработать макет главной страницы сайта с учетом требований пользователей',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(now.getTime() + oneDay),
      assignee: 'Вы',
      projectIds: ['demo-project-1'],
      isCompleted: false,
      tags: ['дизайн', 'UI/UX'],
      createdAt: new Date(now.getTime() - threeDays),
      updatedAt: now
    },
    {
      id: 'demo-task-2',
      title: 'Настроить сборку проекта',
      description: 'Настроить webpack и babel для сборки проекта',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(now.getTime() + 2 * oneDay),
      assignee: 'Вы',
      projectIds: ['demo-project-1'],
      isCompleted: false,
      tags: ['webpack', 'development'],
      createdAt: new Date(now.getTime() - 2 * oneDay),
      updatedAt: now
    },
    {
      id: 'demo-task-3',
      title: 'Написать unit-тесты',
      description: 'Создать тесты для основных компонентов приложения',
      status: 'todo',
      priority: 'low',
      dueDate: new Date(now.getTime() + 5 * oneDay),
      assignee: 'Вы',
      projectIds: ['demo-project-1'],
      isCompleted: false,
      tags: ['testing', 'development'],
      createdAt: new Date(now.getTime() - oneDay),
      updatedAt: now
    },
    {
      id: 'demo-task-4',
      title: 'Создать контент-план',
      description: 'Разработать план публикаций в социальных сетях на месяц',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(now.getTime() + oneDay),
      assignee: 'Мария',
      projectIds: ['demo-project-2'],
      isCompleted: false,
      tags: ['content', 'marketing'],
      createdAt: new Date(now.getTime() - 4 * oneDay),
      updatedAt: now
    },
    {
      id: 'demo-task-5',
      title: 'Проанализировать конкурентов',
      description: 'Изучить стратегии конкурентов и определить сильные и слабые стороны',
      status: 'done',
      priority: 'medium',
      dueDate: new Date(now.getTime() - oneDay),
      assignee: 'Алексей',
      projectIds: ['demo-project-2'],
      isCompleted: true,
      tags: ['analysis', 'strategy'],
      createdAt: new Date(now.getTime() - 7 * oneDay),
      updatedAt: new Date(now.getTime() - oneDay)
    },
    {
      id: 'demo-task-6',
      title: 'Купить продукты',
      description: 'Молоко, хлеб, фрукты, овощи',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(now.getTime() + oneDay),
      assignee: 'Вы',
      projectIds: ['demo-project-3'],
      isCompleted: false,
      tags: ['personal'],
      createdAt: new Date(now.getTime() - 0.5 * oneDay),
      updatedAt: now
    }
  ];
} 