const User = require('../Model/User')
const express = require('express')
const router = express.Router()

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
  // setting session
  req.session.name = u.name
  req.session.uid = u._id.toString()
  res.json({ code: 1, msg: '登录成功', userName: u.name })
})

router.get('/', (req, res) => {
  const { name, uid } = req.session
  res.json(name)
})

module.exports = router
