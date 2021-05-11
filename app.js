const { logger, registerLogger } = require('./logger')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const history = require('connect-history-api-fallback')

const app = express()
registerLogger(app)

if (app.get('env') === 'PROD') {
  app.use(require('compression')())
  //  HTML5 history complements Vue router mode
  app.use(history())
} else {
  app.use(
    cors({
      credentials: true,
      // for vue cli
      origin: 'http://localhost:8080'
    })
  )
}

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(require('./session'))

// Router
app.use('/user', require('./routes/user.js'))
app.use('/session', require('./routes/session.js'))
app.use('/book', require('./routes/book.js'))
app.use('/comment', require('./routes/comment.js'))
app.use('/images', require('./routes/images.js'))

app.all('*', (req, res) => res.status(404).send('NOT FOUND'))

logger.info('Server starts to run')
logger.info(`Environment: ${app.get('env')}`)
module.exports = app
