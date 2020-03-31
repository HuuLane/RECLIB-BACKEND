const express = require('express')
const router = express.Router()
const path = require('path')
const { logger } = require('../utils')

/* GET home page. */
router.get('/', (req, res, next) => {
  logger.info('访客ip', req.ip)
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

module.exports = router
