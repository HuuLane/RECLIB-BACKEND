const express = require('express')
const router = express.Router()
const User = require('../Model/User')
const { logger } = require('../utils')
const to = require('await-to-js').default

router.post('/', async (req, res) => {
  const u = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name
  })

  const [err, data] = await to(u.save())

  if (err) {
    if (err.code === 11000) {
      res.json({
        code: 2,
        msg: 'Username or email is existed'
      })
    } else {
      res.json({
        code: 0,
        msg: 'Fail to sign up'
      })
      logger.error('Fail to signup', err)
    }
  } else {
    req.session.name = data.name
    req.session.uid = data._id.toString()
    res.json({
      code: 1,
      msg: 'Create account successfully'
    })
  }
})

module.exports = router
