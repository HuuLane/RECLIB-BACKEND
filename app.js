const { logger, registerLogger } = require('./utils')
// 奇怪的 bug
const env = process.env.NODE_ENV

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
// 引入插件
const compression = require('compression')
const cors = require('cors')
const history = require('connect-history-api-fallback')

const app = express()
registerLogger(app)

if (env === 'production') {
  // 使用 history 模式
  app.use(compression())
  app.use(history())
} else {
  logger.info('调试环境')
  app.use(cors())
}
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Router
app.use('/signup', require('./routes/signup.js'))
app.use('/login', require('./routes/login.js'))
app.use('/api', require('./routes/api.js'))
app.use('/comment', require('./routes/comment.js'))
app.use('/stock', require('./routes/stock.js'))
app.use('/logout', require('./routes/logout.js'))
app.use('/profile', require('./routes/profile.js'))
// 盗链.. 让 server 来中转.
app.use('/images', require('./routes/images.js'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  // 跳转至 404 页面
  res.redirect('/404')
})

logger.info('1. Server starts to run')
logger.info(`2. Environment: ${env}`)
logger.info(`3. IP: http://127.0.0.1:3000`)
module.exports = app
