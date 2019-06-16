// 引入数据库
const { StockAndCommit } = require('../src/db-utils')
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
  // cookie: {
  //   maxAge: 30 * 24 * 60 * 1000 // 有效期，单位是毫秒
  // },
  // cookie: { domain: 'http://localhost:8080', path: '/', httpOnly: true, secure: false, maxAge: null }
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
  log('userID', userID)
  if (!name) {
    return res.json({ code: 0, msg: '借书登录先啊, 衰仔!' })
  }
  const { id: _id } = req.body
  const theBook = await StockAndCommit.findOne({
    _id
  })
  // 没有该书
  if (!theBook) {
    return res.json({ code: 3, msg: '没有该书, 请联系我!' })
  }
  const { count, rentOut } = theBook.stock
  if (rentOut.length >= count) {
    return res.json({ code: 0, msg: '不能再借了' })
  }
  // 借者信息登记
  const info = {
    userID,
    name,
    date: new Date().getTime()
  }
  try {
    log('info', info)
    await theBook.stock.rentOut.push(info)
    // ! 这儿坑我许久, comment那个更新好好地, 这个却死活不出来
    // ! 我猜测是因为 底层实现 无法监视, 数组/对象发生了变化, 所有要手动通知.
    theBook.markModified('stock')
    await theBook.save()
    res.json({ code: 1, msg: '借书成功' })
  } catch (error) {
    log('error', error)
    res.json({ code: 5, msg: '数据库发生错误, 请联系我' })
  }
})

router.get('/', async (req, res) => {
  const { id: _id } = req.body
  const theBook = await StockAndCommit.findOne({
    _id
  })
  // FIXME:如果没有该字段会报错, 但这样写法很蠢, 向数据库要了两次
  if (!theBook) {
    return res.json({ code: 0, msg: '没有此书, 联系我!' })
  }
  // 现在可以安心 get stock
  const { stock } = await StockAndCommit.findOne({
    _id
  }).select('stock').exec()
  // 真没有..
  res.json({ code: 1, msg: '有该书记录', stock })
})

module.exports = router
