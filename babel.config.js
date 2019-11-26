module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [
      "@babel/typescript",
      [
        "@babel/preset-env",
        {
          "targets": "> 0.25%, not dead"
        }
      ]
    ],
    plugins: [
      [
        "@babel/plugin-proposal-decorators",
        {
          legacy: true
        }
      ],
      [
        "@babel/plugin-proposal-class-properties",
        {
          loose: true
        }
      ],
      "@babel/plugin-transform-runtime"
    ]
  };
};
