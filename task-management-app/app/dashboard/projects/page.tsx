'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  PlusCircle, 
  MoreHorizontal, 
  X, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Calendar,
  User,
  Tag 
} from 'lucide-react';
import useProjectStore from '../../store/useProjectStore';
import useTaskStore, { Task, TaskStatus, TaskPriority } from '../../store/useTaskStore';

// Компонент для отображения задачи
interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

function TaskCard({ task, onClick }: TaskCardProps) {
  // Определяем стили в зависимости от приоритета
  const priorityClass = useMemo(() => {
    switch(task.priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }, [task.priority]);

  // Определяем стили в зависимости от статуса
  const statusClass = useMemo(() => {
    switch(task.status) {
      case 'todo': return 'border-l-4 border-gray-400';
      case 'in_progress': return 'border-l-4 border-blue-400';
      case 'review': return 'border-l-4 border-purple-400';
      case 'done': return 'border-l-4 border-green-400';
      default: return 'border-l-4 border-gray-400';
    }
  }, [task.status]);

  // Преобразуем статус для отображения
  const statusText = useMemo(() => {
    switch(task.status) {
      case 'todo': return 'По плану';
      case 'in_progress': return 'В процессе';
      case 'review': return 'На проверке';
      case 'done': return 'Выполнено';
      default: return 'По плану';
    }
  }, [task.status]);

  return (
    <div 
      className={`p-3 mb-2 bg-white rounded shadow cursor-pointer ${statusClass} hover:shadow-md transition-shadow`}
      onClick={() => onClick(task)}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-800 truncate">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${priorityClass}`}>
          {task.priority === 'low' ? 'Низкий' : 
           task.priority === 'medium' ? 'Средний' : 
           task.priority === 'high' ? 'Высокий' : 'Срочный'}
        </span>
      </div>
      
      <div className="text-xs text-gray-500">
        {task.dueDate && (
          <div className="flex items-center mb-1">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
        <div className="flex items-center">
          <span className={`inline-block w-2 h-2 mr-1 rounded-full ${
            task.status === 'todo' ? 'bg-gray-400' : 
            task.status === 'in_progress' ? 'bg-blue-400' : 
            task.status === 'review' ? 'bg-purple-400' : 'bg-green-400'
          }`}></span>
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
}

// Компонент для отображения проекта (колонки)
interface ProjectColumnProps {
  project: {
    id: string;
    name: string;
    color?: string;
    tasks: string[];
  };
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (projectId: string) => void;
}

function ProjectColumn({ project, tasks, onTaskClick, onAddTask }: ProjectColumnProps) {
  return (
    <div className="flex flex-col w-80 bg-gray-100 rounded shadow-sm">
      {/* Заголовок проекта */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <span className={`inline-block w-3 h-3 rounded-full bg-${project.color || 'blue'}-500`}></span>
          <h2 className="font-medium text-gray-800">{project.name}</h2>
          <span className="px-2 py-0.5 text-xs bg-gray-200 rounded-full">
            {tasks.length}
          </span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Задачи */}
      <div className="flex-1 p-3 overflow-y-auto max-h-[calc(100vh-200px)]">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={onTaskClick} />
        ))}
        
        {/* Кнопка добавления задачи */}
        <button 
          className="flex items-center justify-center w-full p-2 mt-2 text-sm text-gray-500 border border-dashed border-gray-300 rounded hover:text-blue-500 hover:border-blue-500"
          onClick={() => onAddTask(project.id)}
        >
          <PlusCircle className="w-4 h-4 mr-1" />
          Добавить задачу
        </button>
      </div>
    </div>
  );
}

// Компонент детали задачи
interface TaskDetailsProps {
  task: Task | null;
  onClose: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onPriorityChange: (priority: TaskPriority) => void;
  onSave: (updatedTask: Partial<Task>) => void;
}

function TaskDetails({ task, onClose, onStatusChange, onPriorityChange, onSave }: TaskDetailsProps) {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );

  const handleSave = () => {
    onSave({
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });
  };

  // Преобразуем статус для отображения
  const getStatusText = (status: TaskStatus) => {
    switch(status) {
      case 'todo': return 'По плану';
      case 'in_progress': return 'В процессе';
      case 'review': return 'На проверке';
      case 'done': return 'Выполнено';
      default: return 'По плану';
    }
  };

  // Преобразуем приоритет для отображения
  const getPriorityText = (priority: TaskPriority) => {
    switch(priority) {
      case 'low': return 'Низкий';
      case 'medium': return 'Средний';
      case 'high': return 'Высокий';
      case 'urgent': return 'Срочный';
      default: return 'Низкий';
    }
  };

  // Определяем классы стилей для статуса
  const getStatusClass = (status: TaskStatus) => {
    switch(status) {
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Определяем классы стилей для приоритета
  const getPriorityClass = (priority: TaskPriority) => {
    switch(priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Задача {task.id}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="p-4">
          {/* Заголовок задачи */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Заголовок
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Описание */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Описание
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Поля */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Статус */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Статус
              </label>
              <div className="space-y-2">
                {(['todo', 'in_progress', 'review', 'done'] as TaskStatus[]).map((status) => (
                  <button
                    key={status}
                    className={`mr-2 px-3 py-1 text-sm rounded-full ${
                      task.status === status ? getStatusClass(status) : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => onStatusChange(status)}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Приоритет */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Приоритет
              </label>
              <div className="space-y-2">
                {(['low', 'medium', 'high', 'urgent'] as TaskPriority[]).map((priority) => (
                  <button
                    key={priority}
                    className={`mr-2 px-3 py-1 text-sm rounded-full ${
                      task.priority === priority ? getPriorityClass(priority) : 'bg-gray-100 text-gray-600'
                    }`}
                    onClick={() => onPriorityChange(priority)}
                  >
                    {getPriorityText(priority)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Срок выполнения */}
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Срок выполнения
            </label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end p-4 border-t">
          <button
            className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={handleSave}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}

// Основной компонент страницы проектов
export default function ProjectsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const projectStore = useProjectStore();
  const taskStore = useTaskStore();
  const { projects, fetchProjects, addProject } = projectStore;
  const { tasks, fetchTasks, addTask, updateTask } = taskStore;
  
  // Состояние для модальных окон и выбранной задачи
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskProjectId, setNewTaskProjectId] = useState<string | null>(null);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority
  });

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    } else {
      fetchProjects();
      fetchTasks();
    }
  }, [status, router, fetchProjects, fetchTasks]);

  // Фильтрация задач по проектам
  const getTasksByProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return [];
    return tasks.filter(task => project.tasks.includes(task.id));
  };

  // Обработчики событий
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleStatusChange = (status: TaskStatus) => {
    if (selectedTask) {
      updateTask(selectedTask.id, { status });
      setSelectedTask({ ...selectedTask, status });
    }
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    if (selectedTask) {
      updateTask(selectedTask.id, { priority });
      setSelectedTask({ ...selectedTask, priority });
    }
  };

  const handleTaskSave = (updatedTask: Partial<Task>) => {
    if (selectedTask) {
      updateTask(selectedTask.id, updatedTask);
      setSelectedTask(null);
    }
  };

  const handleAddTask = (projectId: string) => {
    setNewTaskProjectId(projectId);
    setIsNewTaskModalOpen(true);
  };

  const handleCreateTask = async () => {
    if (!newTaskProjectId || !newTaskData.title.trim()) return;
    
    try {
      // Создаем новую задачу через API
      const newTask = await addTask({
        title: newTaskData.title,
        status: newTaskData.status,
        priority: newTaskData.priority,
        projectIds: [newTaskProjectId],
        isCompleted: false
      });
      
      // Сбрасываем форму и закрываем модальное окно
      setNewTaskData({ title: '', status: 'todo', priority: 'medium' });
      setIsNewTaskModalOpen(false);
      setNewTaskProjectId(null);
      
      // Обновляем список задач
      if (newTask) {
        // Перезагружаем проекты, чтобы обновить связи с задачами
        await fetchProjects();
      }
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    
    try {
      await addProject({
        name: newProjectName,
        color: ['blue', 'green', 'purple', 'red', 'yellow'][Math.floor(Math.random() * 5)],
      });
      
      setNewProjectName('');
      setIsNewProjectModalOpen(false);
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Показываем ошибки, если они есть */}
      {(projectStore.error || taskStore.error) && (
        <div className="p-4 mb-4 text-red-700 bg-red-100 rounded-md">
          <p className="font-medium">Ошибка:</p>
          <p>{projectStore.error || taskStore.error}</p>
        </div>
      )}
      
      {/* Индикатор загрузки */}
      {(projectStore.isLoading || taskStore.isLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Заголовок страницы */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Проекты</h1>
          <p className="text-sm text-gray-500">
            Управляйте проектами и задачами
          </p>
        </div>
        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          onClick={() => setIsNewProjectModalOpen(true)}
        >
          <PlusCircle className="inline-block w-4 h-4 mr-1" />
          Добавить проект
        </button>
      </div>

      {/* Проекты в виде столбцов */}
      <div className="flex overflow-x-auto pb-4 space-x-4">
        {projects.map(project => (
          <ProjectColumn
            key={project.id}
            project={project}
            tasks={getTasksByProject(project.id)}
            onTaskClick={handleTaskClick}
            onAddTask={handleAddTask}
          />
        ))}
        
        {/* Кнопка добавления нового проекта */}
        <div className="flex items-center justify-center w-80 h-20 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
          <button
            className="flex items-center text-gray-500 hover:text-blue-500"
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Добавить проект
          </button>
        </div>
      </div>

      {/* Модальное окно с деталями задачи */}
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
          onSave={handleTaskSave}
        />
      )}

      {/* Модальное окно создания нового проекта */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Новый проект</h3>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Название проекта
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Введите название проекта"
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setIsNewProjectModalOpen(false)}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={handleCreateProject}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно создания новой задачи */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Новая задача</h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Название задачи
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newTaskData.title}
                onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})}
                placeholder="Введите название задачи"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Приоритет
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newTaskData.priority}
                onChange={(e) => setNewTaskData({
                  ...newTaskData, 
                  priority: e.target.value as TaskPriority
                })}
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
                <option value="urgent">Срочный</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 mr-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setIsNewTaskModalOpen(false)}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={handleCreateTask}
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 