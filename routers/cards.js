const router = require('express').Router();
const path = require('path');

const readFile = require('../utils/read-file');
const pathCards = path.join(__dirname, '../data/cards.json');

// Маршрут для карточек
router.get('/cards', (req, res) => {
  readFile(pathCards).then(data => res.send(data));
});

module.exports = router;
