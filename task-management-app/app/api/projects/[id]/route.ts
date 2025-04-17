import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectToDatabase } from '@/app/lib/db';
import { ObjectId } from 'mongodb';

// Получение конкретного проекта по ID
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
    
    const { db } = await connectToDatabase();
    
    // Ищем проект по ID
    const project = await db.collection('projects').findOne({
      _id: new ObjectId(id),
      userId: session.user.email
    });
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Преобразуем _id в id для фронтенда
    return NextResponse.json({
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      color: project.color,
      tasks: project.tasks || [],
      createdAt: project.createdAt,
      updatedAt: project.updatedAt
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// Обновление проекта по ID
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
    
    // Получаем данные из запроса
    const data = await req.json();
    
    const { db } = await connectToDatabase();
    
    // Проверяем существование проекта и права доступа
    const existingProject = await db.collection('projects').findOne({
      _id: new ObjectId(id),
      userId: session.user.email
    });
    
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Подготавливаем данные для обновления
    const updateData: Record<string, any> = {
      updatedAt: new Date()
    };
    
    // Добавляем только те поля, которые были переданы
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.tasks !== undefined) updateData.tasks = data.tasks;
    
    // Обновляем проект
    await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    // Получаем обновленный проект
    const updatedProject = await db.collection('projects').findOne({
      _id: new ObjectId(id)
    });
    
    // Преобразуем _id в id для фронтенда
    return NextResponse.json({
      id: updatedProject._id.toString(),
      name: updatedProject.name,
      description: updatedProject.description,
      color: updatedProject.color,
      tasks: updatedProject.tasks || [],
      createdAt: updatedProject.createdAt,
      updatedAt: updatedProject.updatedAt
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// Удаление проекта по ID
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
    
    const { db } = await connectToDatabase();
    
    // Проверяем существование проекта и права доступа
    const existingProject = await db.collection('projects').findOne({
      _id: new ObjectId(id),
      userId: session.user.email
    });
    
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Удаляем проект
    await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 