import swc from "@swc/core";
import path from 'path';
import { WebpackPluginInstance } from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { PHASE_PRODUCTION_BUILD, PHASE_DEVELOPMENT_SERVER } from 'next/constants';

type Configuration = WebpackConfiguration & {
  devServer?: WebpackDevServerConfiguration;
}

const isProduction = process.env.NODE_ENV === 'production';

const config: Configuration = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Set up SWC loader for js, ts, tsx, es, and es6 files
  webpack: (config, { dev, isServer }) => {
    if (!isServer && dev) {
      config.optimization = {
        splitChunks: {
          cacheGroups: {
            default: false,
            vendor: {
              test: /node_modules/,
              name: 'vendor',
              chunks: 'all',
              enforce: true,
            },
          },
        },
      };

      config.plugins?.push(new CompressionPlugin());
    }

    config.module.rules.push({
      test: /\.(js|ts|tsx|es|es6|mjs)$/,
      exclude: /node_modules/,
      use: {
        loader: "swc-loader",
        options: {
          jsc: {
            parser: {
              syntax: "typescript",
              jsx: true,
            },
            transform: {
              react: {
                runtime: "automatic",
              },
            },
          },
        },
      },
    });

    // Include __tests__  directory in module resolution
    config.resolve.modules.push(path.resolve(`${options.dir}/__tests__`));

    return config;
  },

  // Add caching headers to static assets in production
  headers: async () => {
    if (!isProduction) {
      return [];
    }

    return [
      {
        source: '/(.*).(js|ts|es|es6|tsx|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Add security headers in production
  async headers() {
    if (!isProduction) {
      return [];
    }

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'",
          },
        ],
      },
    ];
  },
};

export default config;