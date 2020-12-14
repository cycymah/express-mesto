const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routers/users.js');
const usersCards = require('./routers/cards.js');
const { login, createUser } = require('./controllers/Users');
const autoriz = require('./middlewares/auth');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useFindAndModify: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(autoriz);
app.use('/', usersRouter);
app.use('/', usersCards);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.listen(PORT);
