const express = require('express')
const router = express.Router()
const User = require('../Model/User')

router.post('/', async (req, res, next) => {
  const u = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  })

  u.save()
    .then(response => {
      res.json({
        code: 1,
        msg: '创建账户成功'
      })
    })
    .catch(err => {
      if (err.code === 11000) {
        res.json({
          code: 2,
          msg: '用户名 或者 邮箱已有人先'
        })
        return
      }
      res.json({
        code: 0,
        msg: '创建账户失败, 请联系我'
      })
      console.error('*signup', err)
    })
})

module.exports = router
