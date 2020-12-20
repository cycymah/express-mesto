const Cards = require('../models/cards');
const NotFoundError = require('../error/NotFoundError');

module.exports.getCards = (req, res) => {
  Cards.find()
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.message === 'getFail') {
        return res.status(200).send([]);
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
  Cards.create({ ...card, owner: req.user._id })
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Ресурс недоступен' });
    });
};

// Удаляем карточку
module.exports.deleteCard = (req, res, next) => {
  const { id } = req.params;

  Cards.findById({ _id: id })
    .orFail()
    .catch(() => {
      throw new NotFoundError({ message: 'Нет карточки с таким id' });
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw res.status(403).send({ message: 'Недостаточно прав' });
      }
      Cards.findByIdAndRemove({ _id: id })
        .then((cardInfo) => res.status(200).send(cardInfo))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Не валидно' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
