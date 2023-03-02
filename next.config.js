module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fix "regeneratorRuntime is not defined" error
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "regenerator-runtime": require.resolve("regenerator-runtime"),
      };
    }
    return config;
  },
};