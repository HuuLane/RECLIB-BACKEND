const User = require('../Model/User')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res, next) => {
  const { email, password } = req.body
  const u = await User.findOne({ email })
  if (!u) {
    return res.json({
      code: 2,
      msg: 'unregistered'
    })
  }
  if (!(await u.comparePasswd(password))) {
    return res.json({
      code: 0,
      msg: 'wrong password'
    })
  }

  // setting session
  req.session.name = u.name
  req.session.uid = u._id.toString()

  res.json({ code: 1, msg: 'login successful', userName: u.name })
})

router.get('/', (req, res) => {
  res.json({ userName: req.session.name })
})

module.exports = router
