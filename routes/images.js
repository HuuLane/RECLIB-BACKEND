const express = require('express')
const router = express.Router()
const axios = require('axios').default
const { logger } = require('../logger')

const baseLink = 'https://img3.doubanio.com/view/subject/l/public/'
const send = {
  method: 'GET',
  responseType: 'arraybuffer',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
  }
}

router.get('/:imgID', async (req, res) => {
  const i = req.params.imgID
  send.url = baseLink + i
  try {
    const r = await axios(send)
    if (r.status === 200) {
      res.set('Content-Type', 'image')
      res.send(r.data)
    } else {
      res.status(404).send('No the image')
    }
  } catch (error) {
    logger.error(error)
    res.status(500).send('Some error occur')
  }
})

module.exports = router
