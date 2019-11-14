const uuid = require('uuid/v4');

window.URL.createObjectURL = (blob) => {
  return `blob:${uuid()}`;
};
