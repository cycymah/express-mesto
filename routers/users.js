const router = require('express').Router();
const { getUsers, getUserById, getCurrentUser } = require('../controllers/Users');

// Маршрут для списка пользователей
router.get('/users', getUsers);

// Маршрут для пользователя по ID
router.get('/users/:id', getUserById);

router.get('users/me', getCurrentUser);

// Маршрут для отправки пользователя
module.exports = router;
