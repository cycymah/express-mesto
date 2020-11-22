const Cards = require('../models/cards');

module.exports.getCards = (req, res) => {
  Cards.find()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch(() => res.status(404).send({ message: 'Ресурс недоступен' }));
};

module.exports.createCard = (req, res) => {
  const card = req.body;
  Cards.create({ ...card, likes: req.user._id, owner: req.user._id })
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send({ message: `${err}` }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findOneAndDelete({ _id: cardId })
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: `Карточки с id: ${cardId} не существует` });
      }
      return res.status(200).send(card);
    });
};
