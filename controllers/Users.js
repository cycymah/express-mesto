const Users = require('../models/users');

module.exports.getUsers = (req, res) => {
  Users.find()
    .then((data) => res.send(data))
    .catch(() => {
      res.status(500).send({ message: 'Нет такого файла' });
    });
};

module.exports.getUserById = (req, res) => {
  const { id } = req.params;
  Users.findOne({ _id: id }).then((user) => {
    if (!user) {
      return res.status(404).send({ message: `Пользователя с id: ${id} не существует` });
    }
    return res.send(user);
  });
};

module.exports.createUser = (req, res) => {
  const user = req.body;
  Users.create(user)
    .then(() => res.status(200).send(user))
    .catch(() => res.status(404).send({ message: 'Ресурс недоступен' }));
};
