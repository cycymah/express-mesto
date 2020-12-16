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

// Ставим лайки
module.exports.putLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Ресурс не найден' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => next(err));
};

// Удаляем лайк
module.exports.deleteLike = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Ресурс не найден' });
      }
      return res.status(200).send(card);
    })
    .catch((err) => next(err));
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

// Удаляем карточку
module.exports.deleteCard = (req, res) => {
  console.log(req.params);
  const { cardId } = req.params;
  Cards.findByIdAndRemove({ _id: cardId })
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
