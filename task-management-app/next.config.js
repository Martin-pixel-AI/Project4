/** @type {import('next').NextConfig} */
const nextConfig = {
  // Базовая конфигурация Next.js
  reactStrictMode: true,
  swcMinify: true,
  
  // Настройки для изображений
  images: {
    domains: ['localhost'],
  },
  
  // Настройки для окружения
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

module.exports = nextConfig; 