const express = require('express');

const app = express();
const PORT = 3000;
const path = require('path');
const usersRouter = require('./routers/users.js');
const usersCards = require('./routers/cards.js');

app.use(express.static(path.join(__dirname, './public')));

app.use('/', usersRouter);
app.use('/', usersCards);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});
app.listen(PORT, () => console.log(`Слушаем порт ${PORT}`));
