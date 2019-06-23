// session manage
const session = require('express-session')
const FileStore = require('session-file-store')(session)
module.exports = session({
  secret: 'huuuu',
  store: new FileStore(),
  saveUninitialized: false,
  resave: false,
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
})
