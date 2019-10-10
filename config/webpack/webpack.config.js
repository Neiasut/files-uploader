const merge = require('webpack-merge');
const base = require('./parts/base');
const watch = require('./parts/watch');
const loaders = require('./parts/loaders');

module.exports = function(env, argv) {
  return merge(
    base(argv),
    loaders(),
    watch(argv)
  );
};
