const HtmlWebpackPlugin = require('html-webpack-plugin');
const functions = require('./functions');
const rootPath = functions.getRootPath();

const getDefaultConfig = () => {
  return {
    entry: [rootPath + '/dev/script.ts', rootPath + '/src/styles/FilesUploader.scss'],
    watchOptions: {
      aggregateTimeout: 3000,
      poll: 1000
    },
    devServer: {
      port: 9002,
      open: true,
      watchContentBase: true
    },
    output: {
      filename: 'watch.js',
      path: rootPath + '/watch'
    },
    plugins: []
  }
};

const getWatchConfig = () => {
  const config = getDefaultConfig();
  config.plugins.push(
    new HtmlWebpackPlugin({
      template: rootPath + '/dev/index.html'
    })
  );

  return config;
};

module.exports = argv => {
  if (functions.checkWatch(argv)) {
    return getWatchConfig();
  }
  return {};
};
