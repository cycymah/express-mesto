const fsPromise = require('fs').promises;

// Парсим и возвращаем промис с JSON
module.exports = path => {
  return fsPromise.readFile(path, 'utf8').then(data => JSON.parse(data));
};
