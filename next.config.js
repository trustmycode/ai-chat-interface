/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    poweredByHeader: false,
    // Ограничение размера статических данных страницы
    experimental: {
        largePageDataBytes: 128 * 1000, // 128KB
    },
    // Оптимизации webpack
    webpack: (config, { isServer }) => {
        // Оптимизируем бандл
        config.optimization.minimize = true;
        
        // Увеличиваем лимит размера assets
        config.performance = {
            ...config.performance,
            maxAssetSize: 500000, // 500KB
            maxEntrypointSize: 500000, // 500KB
        };
        
        return config;
    },
    // Отключение генерации source maps в production
    productionBrowserSourceMaps: false,
}

module.exports = nextConfig