const { Books, StockAndCommit } = require('../db')
const User = require('../Model/User')
const { logger } = require('../utils')
const router = require('express').Router()

router.post('/', async (req, res) => {
  const { name, uid } = req.session
  if (!name) {
    return res.json({ code: 0, msg: '请先登录' })
  }
  // @params: _id: 书的id, content: 评论内容
  const { id: bookID, content } = req.body

  // retrive book
  const b = await Books.findOne({ _id: bookID })
  if (!b) {
    return res.json({ code: 4, msg: 'no the book' })
  }

  const date = Date.now()
  // 存贮到 document of book 的数据
  const dataOfBook = {
    name,
    userID: uid,
    content,
    date
  }
  // 存贮到 document of User 的数据
  const dataOfUser = {
    bookID,
    content,
    date,
    bookName: b.title
  }
  try {
    // !两头存数据
    await Promise.all([
      User.updateOne(
        { _id: uid },
        { $push: { 'activity.comments': dataOfUser } }
      ),
      StockAndCommit.updateOne(
        { _id: bookID },
        { $push: { comments: dataOfBook } }
      )
    ])
    res.json({ code: 1, msg: '评论成功' })
  } catch (error) {
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
  if (!theBook) {
    return res.json({ code: 0, msg: '没有评论' })
  }
  // 现在可以安心 get comments
  const { comments } = theBook
  // 真没有..
  if (!comments.length) {
    return res.json({ code: 0, msg: '没有评论' })
  }
  res.json({ code: 1, msg: '读取评论成功', comments })
})

module.exports = router
