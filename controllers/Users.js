const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

module.exports.getUsers = (req, res) => {
  Users.find()
    .orFail(new Error('getError'))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.message === 'getError') {
        return [];
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  console.log('GetUserByIs.is    ', req.params.id, '   asd ', req.params);
  Users.findOne({ _id: id })
    .orFail(new Error('getFailId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'getFailId') {
        res.status(404).send({ message: 'Нет такого пользователя' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не валидно' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {

  Users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'Пользователь не найден' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => next(err));
};

module.exports.createUser = (req, res) => {
  const { email, password } = req.body;
  Users.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).send({ message: 'Пользователь уже существует' });
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => Users.create({ email, password: hash }))
    .then((user) => res.status(200).send({
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  Users.findUser(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id },
        'key-secret', { expiresIn: '7d' });
      res.status(200)
        .send({
          token,
          name: user.name,
          email: user.email,
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400)
          .send({ message: 'Ошибка валидации' });
      }
    });
};
