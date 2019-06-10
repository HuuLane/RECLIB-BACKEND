const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  const API_INFO = {
    'about_book': 'http://127.0.0.1:3000/api/book'
  }
  res.json(API_INFO)
})
router.use('/book', require('./api-routers/book'))
module.exports = router
