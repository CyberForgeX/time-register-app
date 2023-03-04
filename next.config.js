const swc = require("@swc/core");

module.exports = {
  webpack: (config, options) => {
    // Set up SWC loader
    config.module.rules.push({
      test: /\.(js|ts|tsx)$/,
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

    // Include __tests__ directory
    config.resolve.modules.push(`${options.dir}/__tests__`);

    return config;
  },
};
