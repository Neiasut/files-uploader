const gzipSize = require('gzip-size');
const path = require('path');
const fs = require('fs');

const getFileSizeInBytes = filename => {
  return new Promise(resolve => {
    const stats = fs.statSync(filename);
    resolve(stats.size);
  });
};

const checkSize = filePath => {
  return new Promise((resolve, reject) => {
    fs.access(filePath, fs.F_OK, (err) => {
      if (err) {
        reject(err);
        return;
      }

      Promise.all([
        getFileSizeInBytes(filePath),
        gzipSize.file(filePath)
      ]).then(arrSizes => {
        resolve({
          size: arrSizes[0],
          gzip: arrSizes[1]
        });
      }).catch(e => {
        reject(e);
      })
    });
  });
};

const toKb = size => (size / 1024).toFixed(2);

checkSize(path.resolve(__dirname, '../dist/filesUploader.min.js'))
  .then(obj => {
    console.log(`file size: ${toKb(obj.size)} kB; gzip: ${toKb(obj.gzip)} kB.`);
  }).catch(e => {
     console.error(e);
  });


