'use client';

import Link from 'next/link';
import { LayoutDashboard, CheckCircle, Calendar, Users, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Проверка загрузки компонентов и зависимостей
    try {
      // Логирование для отладки
      console.log('Home компонент загружен');
    } catch (err) {
      console.error('Ошибка в Home компоненте:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Отладочная информация */}
      {error && (
        <div className="bg-red-100 p-4 border border-red-400 text-red-700 mb-4">
          <h3 className="font-bold">Ошибка:</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center">
            <span className="text-xl font-bold text-blue-600">TaskFlow</span>
          </div>
          <nav className="hidden space-x-10 md:flex">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="relative py-16 overflow-hidden bg-white sm:py-24 lg:py-32">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Manage your team's work <span className="text-blue-600">effortlessly</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600">
              TaskFlow helps teams plan, organize, and collaborate on projects of any size.
              Increase productivity and stay on track with our intuitive task management platform.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 mt-10 sm:flex-row">
              <Link
                href="/signup"
                className="px-8 py-3 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
              <Link
                href="/demo"
                className="px-8 py-3 text-base font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
              >
                See Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section id="features" className="py-16 bg-gray-50 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage projects
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform provides all the tools your team needs to plan, track, and deliver work effectively.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-xl">
                <LayoutDashboard className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-center text-gray-900">Intuitive Dashboard</h3>
              <p className="mt-2 text-base text-center text-gray-600">
                Get a clear overview of all your tasks and projects in one place.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-center text-gray-900">Task Management</h3>
              <p className="mt-2 text-base text-center text-gray-600">
                Create, assign, and track tasks with ease. Add descriptions, attachments, and due dates.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-purple-100 rounded-xl">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-center text-gray-900">Multiple Views</h3>
              <p className="mt-2 text-base text-center text-gray-600">
                Visualize your work in list, board, calendar, or timeline views.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-yellow-100 rounded-xl">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-center text-gray-900">Team Collaboration</h3>
              <p className="mt-2 text-base text-center text-gray-600">
                Work together effectively with roles, permissions, and team workspaces.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-xl">
                <MessageSquare className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="mt-4 text-xl font-medium text-center text-gray-900">Comments & Notifications</h3>
              <p className="mt-2 text-base text-center text-gray-600">
                Discuss tasks, @mention team members, and stay updated with notifications.
              </p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-xl">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-medium text-center text-gray-900">Fast & Responsive</h3>
              <p className="mt-2 text-base text-center text-gray-600">
                Enjoy a smooth experience on any device with our responsive, modern UI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo section */}
      <section id="demo" className="py-20 bg-gray-100">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                See TaskFlow in action
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Watch how easy it is to manage projects, track tasks, and collaborate with your team.
              </p>
            </div>
            
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Демо видео</h3>
                  <p className="text-gray-600">Нажмите для просмотра демонстрации платформы TaskFlow</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Упростите управление задачами
                </h3>
                <p className="text-gray-600 mb-4">
                  TaskFlow предоставляет полный набор инструментов для эффективного управления проектами любой сложности.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Управление задачами</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Командная работа</span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Отчеты</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Аналитика</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 bg-blue-600 sm:py-24">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to streamline your workflow?
            </h2>
            <p className="mt-4 text-xl text-blue-100">
              Join thousands of teams already using TaskFlow to manage their projects.
            </p>
            <div className="mt-10">
              <Link
                href="/signup"
                className="px-8 py-3 text-base font-medium text-blue-600 bg-white rounded-md hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
              >
                Get Started For Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container px-4 mx-auto sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-xl font-bold text-white">TaskFlow</span>
            <p className="mt-2 text-sm text-gray-400">
              &copy; 2025 TaskFlow. All rights reserved.
            </p>
            <div className="flex justify-center mt-6 space-x-6">
              <Link href="/signin" className="text-sm text-gray-400 hover:text-gray-300">
                Sign In
              </Link>
              <Link href="/signup" className="text-sm text-gray-400 hover:text-gray-300">
                Sign Up
              </Link>
              <Link href="#features" className="text-sm text-gray-400 hover:text-gray-300">
                Features
              </Link>
              <Link href="#pricing" className="text-sm text-gray-400 hover:text-gray-300">
                Pricing
              </Link>
              <Link href="#faq" className="text-sm text-gray-400 hover:text-gray-300">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
