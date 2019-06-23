// 引入数据库
const { User } = require('../src/db-utils')
// eslint-disable-next-line
const { log } = console
// 引入路由
const express = require('express')
const router = express.Router()

// session manage
router.use(require('./api-routers/session'))

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
      console.error('生成 session', err)
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
