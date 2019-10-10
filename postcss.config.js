module.exports = () => {
  return {
    plugins: {
      'postcss-preset-env': {
        browsers: 'last 2 versions'
      }
    }
  };
};
