const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  console.log(authorization, ' авторизация');
  console.log(!authorization || !authorization.startsWith('Bearer '), ' avto ',
    (!authorization), ' start ', !authorization.startsWith('Bearer '));
  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('Ошибка 1');
    return res.status(400).send({ message: 'Нужно авторизироваться' });
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'key-secret');
  } catch (err) {
    console.log('Ошибка 2');
    return res.status(400).send({ message: 'Нет атворизации' });
  }

  req.user = payload;
  next();
};

module.exports = auth;
