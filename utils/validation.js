const validator = require('validator');

module.exports.validationUrl = (str) => validator.isURL(str);
