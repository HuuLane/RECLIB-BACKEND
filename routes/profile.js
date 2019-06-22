// 引入数据库
const { User } = require('../src/db-utils')
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
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: 30 * 24 * 3600 * 1000 }
}))

router.get('/', async (req, res, next) => {
  const { userID } = req.session
  // 没有登录
  // log('userID', userID)
  if (!userID) {
    return res.json({ code: 0, msg: '请先登录' })
  }
  const theUser = await User.findOne({
    _id: userID
  })
  // 没有该用户
  if (!theUser) {
    return res.json({ code: 3, msg: '没有该用户, 有疑问请联系我!' })
  }
  const data = await User.findOne({
    _id: userID
  })
    .select('date name index activity')
  return res.json({ code: 1, msg: '成功读取用户数据', data })
})

module.exports = router
