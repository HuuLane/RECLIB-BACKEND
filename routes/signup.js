var express = require('express')
var router = express.Router()
const { User } = require('../src/db-utils')
// eslint-disable-next-line
const { log } = console

router.post('/', (req, res, next) => {
  const someone = new User(req.body)
  someone.save().then((response) => {
    res.json('创建账户成功')
  }).catch(err => {
    console.log('err', err)
    res.json('创建账户失败')
  })
})

module.exports = router
