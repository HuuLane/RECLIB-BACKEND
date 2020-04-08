const express = require('express')
const router = express.Router()

router.delete('/', async (req, res) => {
  const { name } = req.session
  if (!name) {
    return res.json({ code: 0, msg: '都没登录, 怎地登出?' })
  }
  req.session.destroy(err => {
    if (err) {
      return res.json({ code: 0, msg: '退出登录失败, 请联系管理员' })
    }
    // res.clearCookie('sid')
    return res.json({ code: 1, msg: '退出成功, 这是坠吼的吗?' })
  })
})

module.exports = router
