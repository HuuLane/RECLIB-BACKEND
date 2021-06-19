const express = require('express')
const router = express.Router()
const User = require('../model/User')
const { logger } = require('../logger')
const to = require('await-to-js').default

router.get('/:name', async (req, res) => {
  const { name } = req.params
  const [err, data] = await to(
    User.findOne({
      name
    }).select('-comments -password')
  )
  if (data) {
    res.json({ code: 1, msg: 'Successfully read user data', data })
  } else {
    res.json({ code: 3, msg: 'No such user' })
    logger.error(err)
  }
})

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
        msg: 'Web Server have problems'
      })
      logger.error('Fail to signup', err)
    }
  } else {
    req.session.name = data.name
    req.session.uid = data._id.toString()
    res.json({
      code: 1,
      userName: data.name,
      msg: 'Create account successfully'
    })
  }
})

// auto create
// guest & admin account
;(async () => {
  const [err, data] = await to(
    User.findOne({
      name: 'guest'
    })
  )
  if (err) {
    logger.error(err)
    return
  }
  if (!data) {
    const u = new User({
      email: 'guest@typeof.fun',
      password: 'guest@typeof.fun',
      name: 'guest'
    })
    u.save()
    logger.info('create guest')
  }
})()
;(async () => {
  const [err, data] = await to(
    User.findOne({
      name: 'admin'
    })
  )
  if (err) {
    logger.error(err)
    return
  }
  if (!data) {
    const u = new User({
      email: 'admin@typeof.fun',
      password: 'admin@typeof.fun',
      name: 'admin'
    })
    u.save()
    logger.info('create admin')
  }
})()

module.exports = router
