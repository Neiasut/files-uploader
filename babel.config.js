module.exports = api => {
  api.cache.using(() => process.env.NODE_ENV);
  return {
    "presets": [
      "@babel/typescript",
      [
        "@babel/preset-env",
        {
          "targets": "> 0.25%, not dead"
        }
      ]
    ],
    "plugins": [
      "@babel/plugin-transform-runtime",
      "@babel/plugin-proposal-class-properties"
    ]
  };
};
