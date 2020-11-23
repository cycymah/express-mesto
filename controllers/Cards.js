const Cards = require('../models/cards');

module.exports.getCards = (req, res) => {
  Cards.find()
    .orFail(new Error('getFail'))
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.message === 'getFail') {
        res.status(404).send({ message: 'Ресурс недоступен' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const card = req.body;
  Cards.create({ ...card, likes: req.user._id, owner: req.user._id })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(500).send({ message: 'Ошибка валидации' });
      }
      res.status(500).send({ message: 'Ресурс недоступен' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findOneAndDelete({ _id: cardId })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Некорректные данные' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
