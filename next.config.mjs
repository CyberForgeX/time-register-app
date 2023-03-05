const swc = require("@swc/core");
const path = require('path');

module.exports = (phase, { defaultConfig }) => {
  const isProduction = phase === 'production';
  const isDevelopment = !isProduction;
  
  const config = {
    // Set target to serverless for smaller serverless functions
    target: "serverless",
    reactStrictMode: true,
    poweredByHeader: false,
    
    // Set up SWC loader for js, ts, tsx, es, and es6 files
    webpack: (config, options) => {
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
  };
  
  if (isProduction) {
    // Add caching headers to static assets in production
    config.headers = () => [
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
    
    // Add security headers in production
    config.securityHeaders = [
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
    ];
  }
  
  if (isDevelopment) {
    // Add source maps to help with debugging in development
    config.devtool = 'eval-source-map';
  }
  
  return config;
};
