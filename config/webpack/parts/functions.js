const path = require('path');

module.exports = {
  checkWatch: argv => argv.devServer === true,
  getRootPath: () => path.resolve(__dirname, '../../../'),
  checkProd: argv => argv.mode === 'production'
};
