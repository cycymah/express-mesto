const mongoose = require('mongoose');
const validatorUrl = require('validator');

const validationFunction = (str) => validatorUrl.isURL(str);

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    about: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    avatar: {
      type: String,
      required: true,
      validate: validationFunction,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('user', usersSchema);
