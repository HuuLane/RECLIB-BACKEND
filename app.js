const { logger, registerLogger } = require('./utils')
const env = process.env.NODE_ENV

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const history = require('connect-history-api-fallback')

const app = express()

if (env === 'production') {
  app.use(require('compression')())
  //  HTML5 history complements Vue router mode
  app.use(history())
  registerLogger(app)
} else {
  logger.info("LET'S DEV")
  app.use(require('morgan')('dev'))
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
app.use('/login', require('./routes/login.js'))
app.use('/book', require('./routes/book.js'))
app.use('/comment', require('./routes/comment.js'))
app.use('/stock', require('./routes/stock.js'))
app.use('/logout', require('./routes/logout.js'))
app.use('/profile', require('./routes/profile.js'))
app.use('/images', require('./routes/images.js'))

app.all('*', (req, res) => res.status(404).send('NOT FOUND'))

logger.info('1. Server starts to run')
logger.info(`2. Environment: ${env}`)
logger.info(`3. IP: http://127.0.0.1:3000`)
module.exports = app
