const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(400).send({ message: 'Нужно авторизироваться' });
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'key-secret');
  } catch (err) {
    return res.status(400).send({ message: 'Нет атворизации' });
  }
  req.user = payload;
  next();
};

module.exports = auth;
