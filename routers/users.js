const router = require('express').Router();
const { getUsers, getUserById, createUser } = require('../controllers/Users');

// Маршрут для списка пользователей
router.get('/users', getUsers);

// Маршрут для пользователя по ID
router.get('/users/:id', getUserById);

// Маршрут для отправки пользователя
router.post('/users', createUser);

module.exports = router;
