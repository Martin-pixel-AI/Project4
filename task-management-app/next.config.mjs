/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Отключаем source maps в production
  productionBrowserSourceMaps: false,
  // Уменьшаем количество статистической информации
  webpack: (config, { dev, isServer }) => {
    // Отключаем source maps в production для уменьшения использования памяти
    if (!dev) {
      config.devtool = false;
    }
    return config;
  },
};

export default nextConfig; 