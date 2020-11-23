const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const validatorUrl = require('validator');

const validationFunction = (str) => validatorUrl.isURL(str);

const cardsSchema = new mongoose.Schema(
  {
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', default: [] }],
    name: {
      type: String,
      required: true,
      min: 2,
      max: 30,
    },
    link: {
      type: String,
      validate: validationFunction,
    },
    owner: { type: ObjectId, default: [], required: true },
    createdAt: { type: Date, default: Date.now() },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('card', cardsSchema);
