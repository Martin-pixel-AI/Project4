'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { 
  Clock, 
  CheckSquare, 
  Calendar, 
  AlertCircle,
  Users
} from 'lucide-react';
import Link from 'next/link';

// Компонент с контентом дашборда
function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {session?.user?.name || 'User'}! Here's an overview of your tasks and projects.
        </p>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-green-100 rounded-full">
              <CheckSquare className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-red-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Overdue</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-white rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-2xl font-semibold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent tasks */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Recent Tasks</h2>
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {[
              {
                id: 1,
                title: 'Design new landing page',
                project: 'Website Redesign',
                dueDate: '2023-10-25',
                status: 'In Progress',
                statusColor: 'bg-blue-100 text-blue-800',
                assignee: 'You',
              },
              {
                id: 2,
                title: 'Update user authentication',
                project: 'App Development',
                dueDate: '2023-10-23',
                status: 'Todo',
                statusColor: 'bg-gray-100 text-gray-800',
                assignee: 'Alex',
              },
              {
                id: 3,
                title: 'Create marketing materials',
                project: 'Product Launch',
                dueDate: '2023-10-20',
                status: 'Overdue',
                statusColor: 'bg-red-100 text-red-800',
                assignee: 'Sarah',
              },
              {
                id: 4,
                title: 'Prepare presentation',
                project: 'Quarterly Review',
                dueDate: '2023-10-18',
                status: 'Done',
                statusColor: 'bg-green-100 text-green-800',
                assignee: 'You',
              },
            ].map((task) => (
              <li key={task.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-blue-600 truncate">{task.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${task.statusColor}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {task.project}
                      </p>
                      <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                        <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {task.assignee}
                      </p>
                    </div>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      Due {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent projects */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Your Projects</h2>
          <Link href="/dashboard/projects" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            See All
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              id: 1,
              name: 'Website Redesign',
              progress: 65,
              tasks: 15,
              color: 'blue',
            },
            {
              id: 2,
              name: 'Mobile App Development',
              progress: 30,
              tasks: 24,
              color: 'purple',
            },
            {
              id: 3,
              name: 'Marketing Campaign',
              progress: 90,
              tasks: 12,
              color: 'green',
            },
          ].map((project) => (
            <div key={project.id} className="p-5 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                <span className={`h-3 w-3 rounded-full bg-${project.color}-500`}></span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
                  <div
                    style={{ width: `${project.progress}%` }}
                    className={`h-full rounded-full bg-${project.color}-500`}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm">
                <span className="text-gray-500">{project.tasks} tasks</span>
                <Link 
                  href={`/dashboard/projects?project=${project.id}`} 
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Экспортируем компонент с Suspense
export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
    </div>}>
      <DashboardContent />
    </Suspense>
  );
} 