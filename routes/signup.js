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

router.post('/', async (req, res, next) => {
  // TODO
  const count = await User.find({}).countDocuments().exec()
  const userInfo = {
    ...req.body,
    index: count + 1
  }
  const someone = new User(userInfo)
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
    // log(err)
    res.json({
      code: 0,
      msg: '创建账户失败, 请联系我'
    })
  })
})

module.exports = router
