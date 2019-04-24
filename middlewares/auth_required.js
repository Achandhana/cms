const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const key = require('../setup/myurl');

const Person = mongoose.model('Computers');

function authRequired(req, res, next) {
  const cookieData = parseCookieFromHeaders(req.headers)
  if (cookieData.token) {
    jwt.verify(cookieData.token, key.secret, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'unauthorized' });
      } else {
        Person.findById(decoded.id).then(person => {
          req.user = person;
          next();
        }).catch(err => {
          res.status(500).json({ message: 'could not find user with this id' })
        });
      }
    })
  }
}

function parseCookieFromHeaders(headers) {
  const { cookie } = headers;
  if (cookie) {
    const cookieArray = cookie.split(';').map(item => item.trim());
    const cookieData = cookieArray.reduce((acc, curr) => {
      const [k,v] = curr.split('=');
      return { ...acc, [k]: v };
    }, {})
    return cookieData;
  }
}

module.exports = {
  authRequired,
}