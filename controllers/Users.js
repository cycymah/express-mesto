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
  Users.findOne({ _id: id })
    .orFail(new Error('getFailId'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'getFailId') {
        res.status(404).send({ message: 'Нет такого пользователя' });
      } else if (err.message === 'CastError') {
        res.status(400).send({ message: 'Не валидно' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const user = req.body;
  Users.create(user)
    .then(() => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка валидации' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
