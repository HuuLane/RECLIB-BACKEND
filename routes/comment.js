// 引入数据库
const { Books, StockAndCommit, User } = require('../src/db-utils')
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
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: null }
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

router.put('/', async (req, res, next) => {
  const { name, userID } = req.session
  // 没有登录
  if (!name) {
    return res.json({ code: 0, msg: '请先登录' })
  }
  // @params: _id: 书的id, content: 评论内容
  const { id: bookID, content } = req.body
  const theBook = await StockAndCommit.findOne({
    comments: { $exists: true },
    _id: bookID
  })
  if (!theBook) {
    res.json({ code: 4, msg: '没有此书呀, 有疑问请联系我' })
  }
  // 取出书名
  const { title: bookName } = await Books.findOne({
    _id: bookID
  })
  const date = new Date().getTime()
  // 存贮到 document of book 的数据
  const dataOfBook = {
    name,
    userID,
    content,
    date
  }
  // 存贮到 document of User 的数据
  const dataOfUser = {
    bookName,
    bookID,
    content,
    date
  }
  try {
    // !两头存数据
    await Promise.all([
      User.updateOne({ _id: userID }, { $push: { 'activity.comments': dataOfUser } }),
      StockAndCommit.updateOne({ _id: bookID }, { $push: { 'comments': dataOfBook } })
    ])
    res.json({ code: 1, msg: '我很确认收到了您自由的言论' })
  } catch (error) {
    log('error', error)
    res.json({ code: 5, msg: '数据库发生错误, 请联系我' })
  }
})

router.get('/:bookID', async (req, res) => {
  // const { id: _id } = req.body
  const _id = req.params.bookID
  if (!_id) {
    return res.json({ code: 0, msg: '请<del>州长夫人..</del>带上参数!' })
  }
  const theBook = await StockAndCommit.findOne({
    comments: { $exists: true },
    _id
  })
  // FIXME:如果没有该字段会报错, 但这样写法很蠢, 向数据库要了两次
  if (!theBook) {
    return res.json({ code: 0, msg: '没有评论' })
  }
  // 现在可以安心 get comments
  const { comments } = await StockAndCommit.findOne({
    _id
  }).select('comments').exec()
  // 真没有..
  if (!comments.length) {
    return res.json({ code: 0, msg: '没有评论' })
  }
  res.json({ code: 1, msg: '读取评论成功', comments })
})

module.exports = router
