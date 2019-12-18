const express = require('express')
const router = express.Router()
const rp = require('request-promise-native')
const { log } = console

const imgBaseLink = 'https://img3.doubanio.com/view/subject/l/public/'

/*
 * 盗链:
 * 用服务器请求图片(http头 referer 是空的)
 * 浏览器可以直接打开图片完整的 url
 * 说明 nginx 可能对图片设置了 valid_referers none 等等
 * 所以可以下载内容
 * 内容再发给 client
 */

router.get('/:imgID', async (req, res) => {
    const imgID = req.params.imgID

    // log('imgID', imgID)
    const imgReq = {
        url: imgBaseLink + imgID,
        method: 'GET',
        encoding: null,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36'
        },
    }
    
    try {
        const body = await rp(imgReq)
        res.set('Content-Type', 'image/png');
        res.send(body);
    } catch (error) {
        res.status(404)        
    }
})

module.exports = router
