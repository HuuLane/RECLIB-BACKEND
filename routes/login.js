// 引入数据库
const { User } = require('../src/db-utils')
// eslint-disable-next-line
const { log } = console
// 引入路由
const express = require('express')
const router = express.Router()
// session manage
const session = require('express-session')
const FileStore = require('session-file-store')(session)
// const identityKey = 'RECLAB'

router.use(session({
  // name: identityKey,
  secret: 'huuuu', // 用来对session id相关的cookie进行签名
  store: new FileStore(), // 本地存储session（文本文件，也可以选择其他store，比如redis的）
  saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
  resave: false, // 是否每次都重新保存会话，建议false
  // cookie: {
  //   maxAge: 30 * 24 * 60 * 1000 // 有效期，单位是毫秒
  // },
  // cookie: { domain: 'http://localhost:8080', path: '/', httpOnly: true, secure: false, maxAge: null }
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
}))

const cors = require('cors')
router.use(cors({ credentials: true, origin: 'http://localhost:8080' }))
router.all('/', function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, OPTIONS')
  next()
})

router.put('/', async (req, res, next) => {
  const { email, password } = req.body
  const hasSignUp = await User.findOne({
    email
  })
  // 提示没有注册
  if (!hasSignUp) {
    res.json({
      code: 2,
      msg: '未注册'
    })
    return
  }
  const user = await User.findOne({
    email,
    password
  })
  // 密码错误
  if (!user) {
    res.json({
      code: 0,
      msg: '密码错误'
    })
    return
  }
  req.session.regenerate((err) => {
    if (err) {
      log('****err', err)
      res.json({ code: 3, msg: '奇怪的错误, 请联系我!' })
      return
    }
    // 设置 session
    req.session.name = user.name
    // objectID
    req.session.userID = user._id.toString()
    res.json({ code: 1, msg: '登录成功', userName: user.name })
  })
})

router.get('/', (req, res) => {
  const { name, id } = req.session
  log('****SESSION******', name, id)
  res.json(name || null)
})

module.exports = router
