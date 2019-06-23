const express = require('express')
const router = express.Router()
const path = require('path')
const { log } = console
/* GET home page. */
router.get('/', (req, res, next) => {
  log('访客ip', req.ip)
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

module.exports = router
