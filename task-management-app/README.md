# TaskFlow - Task Management Platform

A modern, beautiful task management platform inspired by Asana, built with Next.js, React, and MongoDB.

## Features

- **User Authentication** - Sign up, sign in, and account management
- **Workspaces** - Create and manage organizational workspaces
- **Teams** - Organize members into teams within workspaces
- **Projects** - Create and manage projects with different view types (List, Board, Calendar, Timeline)
- **Tasks** - Create, assign, track, and manage tasks with rich details
- **Comments** - Communicate in the context of tasks
- **Notifications** - Stay updated on task changes and mentions
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

## Tech Stack

- **Frontend**:
  - React with Next.js
  - TailwindCSS for styling
  - Zustand for state management
  - Lucide React for icons

- **Backend**:
  - Next.js API Routes
  - MongoDB with Mongoose for database
  - NextAuth.js for authentication

- **Deployment**:
  - Render

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/task-management-app.git
   cd task-management-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_secret_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app router components and pages
  - `/(auth)` - Authentication pages (sign in, sign up)
  - `/api` - API routes
  - `/dashboard` - Dashboard and app pages
  - `/components` - Reusable UI components
  - `/lib` - Utility functions and helpers
  - `/models` - MongoDB/Mongoose data models
  - `/store` - Zustand state management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
