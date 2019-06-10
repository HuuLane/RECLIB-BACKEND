var express = require('express')
var router = express.Router()
const { User } = require('../src/db-utils')
const { log } = console
/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log('req.cookie', req.cookies)
  res.cookie('name', 'bob', {
    maxAge: 10 * 1000,
    httpOnly: true
  })
  res.render('login')
})

router.post('/', (req, res, next) => {
  // log('req.body', req.body)
  log('req.cookie', req.cookies)

  const someone = new User(req.body)
  someone.save().then((response) => {
    res.json('创建账户成功')
  }).catch(err => {
    console.log('err', err)
    res.json('创建账户失败')
  })
})

module.exports = router
