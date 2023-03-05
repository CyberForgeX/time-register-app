export default {
  jsc: {
    parser: {
      syntax: "typescript",
      dynamicImport: true,
    },
    target: "ESNext",
    jsx: {
      runtime: "automatic",
    },
    externalHelpers: true,
  },
  module: {
    type: "commonjs",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
  }
};