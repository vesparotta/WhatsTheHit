const debug = require('debug')('whatsthehit:auth');

module.exports = (req, res, next) => {
  /*if (req.csrfToken() == req.body.auth) {
    next();
  } else {
    res.send("csrf invalido")
  }*/

  next();
}