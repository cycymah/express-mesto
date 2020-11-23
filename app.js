// Спасибо за труд! Чая, кофе и печенек!
// Огромное спасибо за комментарии! Очень много полезной информации!
// К счастью (или к сожалению), меня как раз взяли на работу!:)
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const usersRouter = require('./routers/users.js');
const usersCards = require('./routers/cards.js');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '5fb97582e0823310c53299f3',
  };

  next();
});

app.use('/', usersRouter);
app.use('/', usersCards);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.listen(PORT);
