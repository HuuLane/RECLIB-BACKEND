const { User } = require('../db')
// 引入路由
const express = require('express')
const router = express.Router()

// session manage
router.use(require('./session'))

router.get('/', async (req, res, next) => {
  const { userID } = req.session
  // 没有登录
  if (!userID) {
    return res.json({ code: 0, msg: '请先登录' })
  }
  try {
    const data = await User.findOne({
      _id: userID
    })
      .select('date name index activity')
    return res.json({ code: 1, msg: '成功读取用户数据', data })
  } catch (error) {
    return res.json({ code: 3, msg: '没有该用户, 有疑问请联系我!' })
  }
})

module.exports = router
