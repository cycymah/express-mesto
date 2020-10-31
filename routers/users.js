/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
const path = require('path');

const pathUsers = path.join(__dirname, '..', 'data', 'users.json');
const readFile = require('../utils/read-file.js');

// Маршрут для списка пользователей
router.get('/users', (req, res) => {
  readFile(pathUsers)
    .then((data) => res.send(data))
    .catch(() => {
      res.status(500).send({ message: 'Нет такого файла' });
    });
});

// Маршрут для пользователя по ID
router.get('/users/:id', (req, res) => {
  const { id } = req.params;

  readFile(pathUsers)
    .then((data) => {
      const user = data.find((person) => person._id === id);
      if (!user) {
        return res
          .status(404)
          .send({ message: `Пользователя с id: ${id} не существует` });
      }
      return res.send(user);
    });
});

module.exports = router;
