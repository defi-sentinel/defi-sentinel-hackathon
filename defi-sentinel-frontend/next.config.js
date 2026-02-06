/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'icons.llamao.fi',
      },
      {
        protocol: 'https',
        hostname: 'cryptologos.cc', // Protocol logos
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com', // CoinMarketCap logos
      },
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com', // CoinGecko logos
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com', // GitHub-hosted logos
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub avatars
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern formats first
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache for optimized images
  },

  // Enable compression (enabled by default in Next.js 15)
  compress: true,

  // Note: swcMinify and optimizeFonts are enabled by default in Next.js 15+

  // HTTP headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Empty turbopack config to acknowledge we're using Turbopack with custom webpack
  turbopack: {},

  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Ignore node-only dev dependencies causing build issues in wagmi/pino
    config.resolve.alias = {
      ...config.resolve.alias,
      'tap': false,
      'tape': false,
      'desm': false,
      'fastbench': false,
      'why-is-node-running': false,
      'pino-elasticsearch': false,
      '@react-native-async-storage/async-storage': false,
    };

    // Advanced webpack optimization
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Framework chunk (React, React-DOM)
          framework: {
            name: 'framework',
            chunks: 'all',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Library chunks
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )?.[1];
              return `npm.${packageName?.replace('@', '')}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          // Commons chunk (shared code)
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
        },
      },
    };

    return config;
  },
};

module.exports = nextConfig;
