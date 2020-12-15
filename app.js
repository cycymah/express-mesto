const express = require('express');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const mongoose = require('mongoose');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const usersRouter = require('./routers/users.js');
const usersCards = require('./routers/cards.js');
const { login, createUser } = require('./controllers/Users');
const autoriz = require('./middlewares/auth');

const app = express();
const PORT = 3000;

const corsConfig = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}

app.use(cors(corsConfig));
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

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      // name: Joi.string().min(2).max(30),
      // about: Joi.string().min(2).max(30),
      // avatar: Joi.string().pattern(/^(http|https):\/\/[^ "]+$/),
    }),
  }),
  createUser);

app.use(autoriz);
app.use('/', usersRouter);
app.use('/', usersCards);

app.use(errorLogger);
app.use(errors());

app.use((req, res, next) => {
  res
    .status(500)
    .send({ message: 'Ошибка сервера!' });
  next();
});

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT);

console.log('Работает на потру', PORT);
