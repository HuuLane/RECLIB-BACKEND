const User = require('../model/User')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.json({ userName: req.session.name })
})

router.post('/', async (req, res, next) => {
  const { email, password } = req.body
  const u = await User.findOne({ email })
  if (!u) {
    return res.json({
      code: 2,
      msg: 'Sorry, that Email is unregistered'
    })
  }
  if (!(await u.comparePasswd(password))) {
    return res.json({
      code: 0,
      msg: "Sorry, that password isn't right."
    })
  }

  // setting session
  req.session.name = u.name
  req.session.uid = u._id.toString()

  res.json({ code: 1, msg: 'Login successful', userName: u.name })
})

router.delete('/', async (req, res) => {
  const { name } = req.session
  if (!name) {
    return res.json({ code: 0, msg: 'No login' })
  }
  req.session.destroy(err => {
    if (err) {
      return res.json({ code: 0, msg: 'Logout failed, server have problem' })
    }
    // res.clearCookie('sid')
    res.json({ code: 1, msg: 'successfully' })
  })
})

module.exports = router
