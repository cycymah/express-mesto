const router = require('express').Router();
// const { celebrate, Joi } = require('celebrate');
const { getUsers, getUserById, getCurrentUser } = require('../controllers/Users');


// Получение пользователя
router.get('/users/me', getCurrentUser);

// Маршрут для списка пользователей
router.get('/users', getUsers);

// Маршрут для пользователя по ID
router.get('/users/:id', getUserById);

// Маршрут для отправки пользователя
module.exports = router;
