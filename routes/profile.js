const User = require('../Model/User')
const express = require('express')
const router = express.Router()
const { logger } = require('../utils')
const to = require('await-to-js').default

router.get('/', async (req, res, next) => {
  const { uid } = req.session
  if (!uid) {
    return res.json({ code: 0, msg: '请先登录' })
  }
  const [err, data] = await to(
    User.findOne({
      _id: uid
    }).select('date name index activity')
  )
  if (data) {
    res.json({ code: 1, msg: '成功读取用户数据', data })
  } else {
    res.json({ code: 3, msg: '没有该用户' })
    logger.error(err)
  }
})

module.exports = router
