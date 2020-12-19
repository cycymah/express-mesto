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

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
    });
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  Users.findOne({ _id: id })
    .orFail(new Error('getFailId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'getFailId') {
        res.status(404).send({ message: 'Нет такого пользователя' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Ошибка сервера' });
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
      return res.status(500).send({ message: 'Ошибка сервера' });
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
    .catch(() => res.status(401).send({ message: 'Неправильные логин или пароль' }));
};
