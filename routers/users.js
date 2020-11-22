/* eslint-disable no-underscore-dangle */
const router = require('express').Router();
// const path = require('path');

// const pathUsers = path.join(__dirname, '..', 'data', 'users.json');
// const readFile = require('../utils/read-file.js');
const { getUsers, getUserById, createUser } = require('../controllers/Users');

// Маршрут для списка пользователей
router.get('/users', getUsers);

// Маршрут для пользователя по ID
router.get('/users/:id', getUserById);

// Маршрут для отправки пользователя
router.post('/users', createUser);

module.exports = router;
