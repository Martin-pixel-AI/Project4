import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

// Получение конкретной задачи по ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Проверяем авторизацию
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Определяем пользовательский идентификатор
    const userId = session.user.isDemoUser ? 'demo@example.com' : (session.user.email || 'anonymous');
    
    const { db } = await connectToDatabase();
    
    // Ищем задачу по ID
    const task = await db.collection('tasks').findOne({
      _id: new ObjectId(id),
      userId: userId
    });
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Преобразуем _id в id для фронтенда
    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// Обновление задачи по ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Проверяем авторизацию
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Определяем пользовательский идентификатор
    const userId = session.user.isDemoUser ? 'demo@example.com' : (session.user.email || 'anonymous');
    
    // Получаем данные из запроса
    const data = await req.json();
    
    const { db } = await connectToDatabase();
    
    // Проверяем существование задачи и права доступа
    const existingTask = await db.collection('tasks').findOne({
      _id: new ObjectId(id),
      userId: userId
    });
    
    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Преобразуем строку даты в объект Date, если она есть
    let dueDate = data.dueDate;
    if (dueDate && typeof dueDate === 'string') {
      dueDate = new Date(dueDate);
    }
    
    // Подготавливаем данные для обновления
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };
    
    // Добавляем только те поля, которые были переданы
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (data.assignee !== undefined) updateData.assignee = data.assignee;
    if (data.projectIds !== undefined) updateData.projectIds = data.projectIds;
    if (data.isCompleted !== undefined) updateData.isCompleted = data.isCompleted;
    if (data.tags !== undefined) updateData.tags = data.tags;
    
    // Обновляем задачу
    await db.collection('tasks').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    // Обновляем проекты, если изменились projectIds
    if (data.projectIds !== undefined && Array.isArray(data.projectIds)) {
      // Удаляем задачу из проектов, в которых она была, но больше не нужна
      const removedProjects = existingTask.projectIds.filter(
        (projectId: string) => !data.projectIds.includes(projectId)
      );
      
      for (const projectId of removedProjects) {
        try {
          await db.collection('projects').updateOne(
            { _id: new ObjectId(projectId) },
            { 
              $pull: { tasks: id },
              $set: { updatedAt: new Date() }
            }
          );
        } catch (error) {
          console.error(`Error removing task from project ${projectId}:`, error);
          // Продолжаем работу даже при ошибке
        }
      }
      
      // Добавляем задачу в новые проекты
      const newProjects = data.projectIds.filter(
        (projectId: string) => !existingTask.projectIds.includes(projectId)
      );
      
      for (const projectId of newProjects) {
        try {
          const project = await db.collection('projects').findOne({
            _id: new ObjectId(projectId),
            userId: userId
          });
          
          if (project) {
            const tasks = project.tasks || [];
            if (!tasks.includes(id)) {
              await db.collection('projects').updateOne(
                { _id: new ObjectId(projectId) },
                { 
                  $set: { 
                    tasks: [...tasks, id],
                    updatedAt: new Date() 
                  }
                }
              );
            }
          }
        } catch (error) {
          console.error(`Error adding task to project ${projectId}:`, error);
          // Продолжаем работу даже при ошибке
        }
      }
    }
    
    // Получаем обновленную задачу
    const updatedTask = await db.collection('tasks').findOne({
      _id: new ObjectId(id)
    });
    
    // Преобразуем _id в id для фронтенда
    return NextResponse.json({
      id: updatedTask._id.toString(),
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
      assignee: updatedTask.assignee,
      projectIds: updatedTask.projectIds || [],
      isCompleted: updatedTask.isCompleted,
      tags: updatedTask.tags || [],
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt
    });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// Удаление задачи по ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Проверяем авторизацию
    const session = await getServerSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Определяем пользовательский идентификатор
    const userId = session.user.isDemoUser ? 'demo@example.com' : (session.user.email || 'anonymous');
    
    const { db } = await connectToDatabase();
    
    // Проверяем существование задачи и права доступа
    const existingTask = await db.collection('tasks').findOne({
      _id: new ObjectId(id),
      userId: userId
    });
    
    if (!existingTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    
    // Удаляем задачу из всех проектов, к которым она была привязана
    if (existingTask.projectIds && Array.isArray(existingTask.projectIds)) {
      for (const projectId of existingTask.projectIds) {
        try {
          await db.collection('projects').updateOne(
            { _id: new ObjectId(projectId) },
            { 
              $pull: { tasks: id },
              $set: { updatedAt: new Date() }
            }
          );
        } catch (error) {
          console.error(`Error removing task from project ${projectId}:`, error);
          // Продолжаем работу даже при ошибке
        }
      }
    }
    
    // Удаляем саму задачу
    await db.collection('tasks').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 