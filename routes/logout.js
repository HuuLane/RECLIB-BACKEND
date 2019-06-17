// eslint-disable-next-line
const { log } = console
// 引入路由
const express = require('express')
const router = express.Router()
// session 管理
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
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: 30 * 24 * 60 * 1000 }
}))

// 跨域设置
const cors = require('cors')
router.use(cors({ credentials: true, origin: 'http://localhost:8080' }))
router.all('/', function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'PUT, GET, OPTIONS')
  next()
})

router.get('/', async (req, res) => {
  const { name } = req.session
  // 没有登录
  if (!name) {
    return res.json({ code: 0, msg: '都没登录, 怎地登出?' })
  }
  req.session.destroy((err) => {
    if (err) {
      return res.json({ code: 0, msg: '退出登录失败, 请联系管理员' })
    }
    log('有人要注销')
    // req.session.loginUser = null;
    res.clearCookie('connect.sid')
    // res.redirect('/')
    return res.json({ code: 1, msg: '退出成功, 这是坠吼的吗?' })
  })
})

module.exports = router
