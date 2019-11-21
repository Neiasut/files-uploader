const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const functions = require('./functions');
const rootPath = functions.getRootPath();
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = function(argv) {
  const prod = functions.checkProd(argv);
  const outputDirectory = rootPath + '/dist';
  const devTool = prod ? false : 'source-map';
  let plugins = [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ];
  let entry = {};

  if (prod) {
    entry = {
      'filesUploader.min': [rootPath + '/src/global.ts', rootPath + '/src/styles/FilesUploader.scss']
    }
  } else {
    entry = {
      'filesUploader': [rootPath + '/src/global.ts', rootPath + '/src/styles/FilesUploader.scss']
    }
  }
  if (argv.build && prod) {
    plugins.unshift(
      new CleanWebpackPlugin()
    );
  }

  return {
    mode: argv.mode,
    devtool: devTool,
    entry,
    output: {
      path: outputDirectory,
      filename: '[name].js'
    },
    plugins: plugins,
    resolve: {
      extensions: ['.ts', '.js']
    },
    externals: {}
  };
};
