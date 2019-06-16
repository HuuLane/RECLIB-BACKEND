const express = require('express')
const router = express.Router()
const path = require('path')

/* GET home page. */
router.get('/', (req, res, next) => {
  // res.send('index', { title: '矩形图书馆' })
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

module.exports = router
