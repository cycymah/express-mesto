const fsPromise = require("fs").promises;

module.exports = path => {
  return fsPromise.readFile(path, "utf8").then(data => JSON.parse(data));
};
