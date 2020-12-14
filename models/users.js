const mongoose = require('mongoose');
const validatorUrl = require('validator');
const bcrypt = require('bcryptjs');

// const validationFunction = (str) => {

//   return validatorUrl.isURL(str)
// };

const usersSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 2,
      max: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      min: 2,
      max: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: validatorUrl.isURL,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    password: {
      type: String,
      min: 8,
      max: 30,
      unique: true,
    },
    email: {
      type: String,
      validate: validatorUrl.isEmail,
      min: 5,
      max: 30,
      unique: true,
    },
  },
  {
    versionKey: false,
  },
);

usersSchema.statics.findUser = (email, password) => this.findOne({ email }).select('+password')
  .then((user) => {
    if (!user) {
      return Promise.reject(new Error('Неправильные почта или пароль'));
    }

    return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
      });
  });

module.exports = mongoose.model('user', usersSchema);
