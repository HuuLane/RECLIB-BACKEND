// 引入数据库
const { StockAndCommit, Books } = require('../db')
const User = require('../Model/User')
// eslint-disable-next-line
const { log } = console
// 引入路由
const express = require('express')
const router = express.Router()

// session manage
router.use(require('./session'))

router.put('/', async (req, res, next) => {
  const { name, userID } = req.session
  // 没有登录
  // log('userID', userID)
  if (!name) {
    return res.json({ code: 0, msg: '借书登录先啊, 衰仔!' })
  }
  const { id: bookID } = req.body
  const theBook = await StockAndCommit.findOne({
    _id: bookID
  })
  // 没有该书
  if (!theBook) {
    return res.json({ code: 3, msg: '没有该书, 请联系我!' })
  }
  // 取出书名, 从 Books 这个 collection 拿
  const { title: bookName } = await Books.findOne({
    _id: bookID
  })
  const { count, rentOut } = theBook.stock
  if (rentOut.length >= count) {
    return res.json({ code: 0, msg: '不能再借了' })
  }
  // 借者信息登记
  const date = new Date().getTime()
  const info = {
    userID,
    name,
    date
  }
  // 存贮到 document of User 的数据
  const userInfo = {
    bookName,
    bookID,
    date
  }
  try {
    // log('info', info)
    // ! 这儿坑我许久, comment那个更新好好地, 这个却死活不出来
    // ! 我猜测是因为 底层实现 无法监视, 数组/对象发生了变化, 所有要手动通知.
    theBook.markModified('stock')
    await theBook.stock.rentOut.push(info)
    // 保存修改内容, 以及 Update 用户数据
    await Promise.all([
      theBook.save(),
      User.updateOne(
        { _id: userID },
        { $push: { 'activity.rentBook': userInfo } }
      )
    ])
    res.json({ code: 1, msg: '借书成功' })
  } catch (error) {
    log('error', error)
    res.json({ code: 5, msg: '数据库发生错误, 请联系我' })
  }
})

router.get('/:bookID', async (req, res) => {
  const _id = req.params.bookID
  if (!_id) {
    return res.json({ code: 0, msg: '请<del>州长夫人..</del>带上参数!' })
  }
  try {
    const { stock } = await StockAndCommit.findOne({ _id })
    res.json({ code: 1, msg: '有该书记录', stock })
  } catch (error) {
    return res.json({ code: 0, msg: '没有此书, 联系我!' })
  }
})

module.exports = router
