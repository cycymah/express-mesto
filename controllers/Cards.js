const Cards = require('../models/cards');

module.exports.getCards = (req, res) => {
  Cards.find()
    .orFail(new Error('getFail'))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.message === 'getFail') {
        return [];
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const card = req.body;
  Cards.create({ ...card, likes: req.user._id, owner: req.user._id })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Ресурс недоступен' });
    });
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findOneAndDelete({ _id: cardId })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.message === 'getFailId') {
        res.status(404).send({ message: 'Нет такой карточки' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не валидно' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
