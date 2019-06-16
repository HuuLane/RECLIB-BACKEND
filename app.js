/* eslint-env node */
const { log } = require('./src/utils')

const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
// 引入第三方插件

// 启动服务
const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 设置路由
app.use('/', require('./routes/index'))
app.use('/signup', require('./routes/signup.js'))
app.use('/login', require('./routes/login.js'))
app.use('/api', require('./routes/api.js'))
app.use('/comment', require('./routes/comment.js'))

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
  res.render('error')
})
log('服务器已启动', 'http://127.0.0.1:3000')
module.exports = app
