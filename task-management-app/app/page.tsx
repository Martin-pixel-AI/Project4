import Link from 'next/link';
import { LayoutDashboard, CheckCircle, Calendar, Users, MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
                href="#demo"
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
