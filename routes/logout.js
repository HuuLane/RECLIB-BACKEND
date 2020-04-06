// eslint-disable-next-line
const { log } = console
// 引入路由
const express = require('express')
const router = express.Router()

// session manage
router.use(require('./session'))

router.get('/', async (req, res) => {
  const { name } = req.session
  // 没有登录
  if (!name) {
    return res.json({ code: 0, msg: '都没登录, 怎地登出?' })
  }
  req.session.destroy((err) => {
    if (err) {
      return res.json({ code: 0, msg: '退出登录失败, 请联系管理员' })
    }
    log('有人要注销')
    // req.session.loginUser = null;
    res.clearCookie('connect.sid')
    // res.redirect('/')
    return res.json({ code: 1, msg: '退出成功, 这是坠吼的吗?' })
  })
})

module.exports = router
