/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Отключаем source maps в production
  productionBrowserSourceMaps: false,
  // Отключаем промежуточные бандлы для уменьшения потребления памяти
  experimental: {
    turbotrace: {
      memoryLimit: 3000, // Лимит памяти для turbo trace (в МБ)
    },
  },
  // Уменьшаем количество статистической информации
  webpack: (config, { dev, isServer }) => {
    // Отключаем source maps в production для уменьшения использования памяти
    if (!dev) {
      config.devtool = false;
      
      // Отключаем детальную статистику сборки
      config.stats = 'errors-only';
      
      // Оптимизация для уменьшения потребления памяти
      config.optimization = {
        ...config.optimization,
        minimize: true,
        sideEffects: true,
      };
    }
    
    return config;
  },
};

export default nextConfig; 