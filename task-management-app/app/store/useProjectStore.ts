'use client';

import { create } from 'zustand';
import { Task } from './useTaskStore';

// Типы для проекта
export interface Project {
  id: string;
  name: string;
  description?: string;
  color?: string;
  tasks: string[]; // ID задач в проекте
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс хранилища проектов
interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  
  // Действия
  fetchProjects: () => Promise<void>;
  fetchProjectById: (id: string) => Promise<Project | null>;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'tasks'>) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTaskToProject: (projectId: string, taskId: string) => Promise<void>;
  removeTaskFromProject: (projectId: string, taskId: string) => Promise<void>;
}

// Создание хранилища
const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  isLoading: false,
  error: null,

  // Получить все проекты
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/projects');
      
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      
      const data = await response.json();
      
      // Преобразуем строки дат в объекты Date
      const projects = data.map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      }));
      
      set({ projects, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Произошла неизвестная ошибка', 
        isLoading: false 
      });
    }
  },

  // Получить проект по ID
  fetchProjectById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      
      const project = await response.json();
      
      // Преобразуем строки дат в объекты Date
      const formattedProject = {
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      };
      
      return formattedProject;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось получить проект', 
        isLoading: false 
      });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  // Добавить новый проект
  addProject: async (projectData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      const newProject = await response.json();
      
      // Преобразуем строки дат в объекты Date
      const formattedProject = {
        ...newProject,
        createdAt: new Date(newProject.createdAt),
        updatedAt: new Date(newProject.updatedAt)
      };
      
      set((state) => ({
        projects: [...state.projects, formattedProject],
        isLoading: false,
      }));
      
      return formattedProject;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось создать проект', 
        isLoading: false 
      });
      return null;
    }
  },

  // Обновить существующий проект
  updateProject: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update project');
      }

      const updatedProject = await response.json();
      
      // Преобразуем строки дат в объекты Date
      const formattedProject = {
        ...updatedProject,
        createdAt: new Date(updatedProject.createdAt),
        updatedAt: new Date(updatedProject.updatedAt)
      };
      
      set((state) => ({
        projects: state.projects.map((project) => 
          project.id === id ? formattedProject : project
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось обновить проект', 
        isLoading: false 
      });
    }
  },

  // Удалить проект
  deleteProject: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось удалить проект', 
        isLoading: false 
      });
    }
  },

  // Добавить задачу в проект
  addTaskToProject: async (projectId, taskId) => {
    try {
      // Получаем текущий проект
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Проект не найден');
      
      if (project.tasks.includes(taskId)) return; // Задача уже в проекте
      
      // Создаем обновленный список задач
      const updatedTasks = [...project.tasks, taskId];
      
      // Обновляем проект через API
      await get().updateProject(projectId, { tasks: updatedTasks });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось добавить задачу в проект', 
        isLoading: false 
      });
    }
  },

  // Удалить задачу из проекта
  removeTaskFromProject: async (projectId, taskId) => {
    try {
      // Получаем текущий проект
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Проект не найден');
      
      // Создаем обновленный список задач
      const updatedTasks = project.tasks.filter(id => id !== taskId);
      
      // Обновляем проект через API
      await get().updateProject(projectId, { tasks: updatedTasks });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Не удалось удалить задачу из проекта', 
        isLoading: false 
      });
    }
  },
}));

export default useProjectStore; 