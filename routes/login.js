const User = require('../Model/User')
const express = require('express')
const router = express.Router()

// session manage
router.use(require('./session'))

router.post('/', async (req, res, next) => {
  const { email, password } = req.body
  const u = await User.findOne({
    email
  })
  if (!u) {
    return res.json({
      code: 2,
      msg: '未注册'
    })
  }
  if (!u.comparePasswd(password)) {
    return res.json({
      code: 0,
      msg: '密码错误'
    })
  }
  req.session.regenerate(err => {
    if (err) {
      console.error('生成 session', err)
      return res.json({ code: 3, msg: '奇怪的错误, 请联系我!' })
    }
    // 设置 session
    req.session.name = u.name
    // objectID
    req.session.userID = u._id.toString()
    res.json({ code: 1, msg: '登录成功', userName: u.name })
  })
})

router.get('/', (req, res) => {
  const { name, id } = req.session
  log('****SESSION******', name, id)
  res.json(name || null)
})

module.exports = router
