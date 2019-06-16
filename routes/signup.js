const express = require('express')
const router = express.Router()
const { User } = require('../src/db-utils')
// eslint-disable-next-line
const { log } = console

router.all('/', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS')
  next()
})

router.options('/', (req, res) => {
  res.sendStatus(200)
})

router.post('/', (req, res, next) => {
  const someone = new User(req.body)
  someone.save().then((response) => {
    res.json({
      code: 1,
      msg: '创建账户成功'
    })
  }).catch(err => {
    if (err.code === 11000) {
      res.json({
        code: 2,
        msg: '用户名 || 邮箱已有人先'
      })
      return
    }
    res.json({
      code: 0,
      msg: '创建账户失败, 请联系我'
    })
  })
})

module.exports = router
