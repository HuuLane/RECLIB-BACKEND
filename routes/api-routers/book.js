/**
 * restful api
 * book 路由
 * 1. 通过 id `?id={id}`精确查询一个条目, 或用 `?intro={id}`得到简介.
 * 2. 通过 tag or author or title 查询多条内容, 只返回第一页数据(10条以内)
 * 3. 通过 score, 筛选评分
 * 4. 如果带上 count 则返回一个数字有多少条.
 * 5. ?page={pageIndex} 得到该页的 documents
 * 写于: 5/29/晴
 */
const express = require('express')
const router = express.Router()

// 引入数据库
const { Books, BooksIntro } = require('../../src/db-utils')
const { log, objectIsEmpty } = require('../../src/utils')
const { getPage } = require('./_get_book_db_api')

const findAll = async (query) => {
  const queryBook = Books.find({
    $or: [
      { _id: query.all },
      { tags: { $regex: '.*' + query.all + '.*' } },
      { title: { $regex: '.*' + query.all + '.*' } },
      { 'info.作者': { $regex: '.*' + query.all + '.*' } }
    ]
  })
  if (query.hasOwnProperty('score')) {
    queryBook.find({ score: { $gte: Number(query.score) } })
  }
  // 如果只是想了解 数据有多少条 (count), 那便只返回 count咯~ 在分页之前
  if (query.hasOwnProperty('count')) {
    return queryBook.countDocuments()
  }
  // 到最后 总是要分页的 我不会一口把所有资料都吐给你 哈哈哈哈
  if (query.hasOwnProperty('page')) {
    return getPage(queryBook, query.page)
  } else {
    return getPage(queryBook, 1)
  }
}

const urlQuery = async (query) => {
  const queryBook = Books.find({})
  // 查tag
  if (query.hasOwnProperty('tag')) {
    // queryBook.find({ tags: query.tag })
    queryBook.find({ tags: { $regex: '.*' + query.tag + '.*' } })
  }
  // 查作者, 正则挺操蛋的..
  if (query.hasOwnProperty('author')) {
    queryBook.find({ 'info.作者': { $regex: '.*' + query.author + '.*' } })
  }
  // 查标题
  if (query.hasOwnProperty('title')) {
    queryBook.find({ title: { $regex: '.*' + query.title + '.*' } })
  }
  // 评分筛选
  if (query.hasOwnProperty('score')) {
    log('Number(query.score)', Number(query.score))
    queryBook.find({ score: { $gte: Number(query.score) } })
  }
  // 如果只是想了解 数据有多少条 (count), 那便只返回 count咯~ 在分页之前
  if (query.hasOwnProperty('count')) {
    return queryBook.countDocuments()
  }
  // 到最后 总是要分页的 我不会一口把所有资料都吐给你 哈哈哈哈
  if (query.hasOwnProperty('page')) {
    return getPage(queryBook, query.page)
  } else {
    return getPage(queryBook, 1)
  }
}

router.get('/', (req, res) => {
  // http://127.0.0.1:3000/api/book
  const query = req.query
  if (objectIsEmpty(query)) {
    const API_INFO = {
      'msg': '请带上参数',
      'get_book_by_id': 'http://127.0.0.1:3000/api/book?id={id}'
    }
    res.json(API_INFO)
  } else {
    log('req.query', query)
    // all最高级
    if (query.hasOwnProperty('all')) {
      findAll(query)
        .then(r => {
          // r 是数组或数字
          if (r) {
            res.json(r)
          } else {
            res.json(null)
          }
        })
      return
    }
    // id, 和得到此id intro 是排它性的: 既然查id 其他条件就不会生效
    if (query.hasOwnProperty('id')) {
      Books.find({ _id: query.id })
        .then(r => {
          // r 是数组
          if (r.length) {
            res.json(r[0])
          } else {
            res.json(null)
          }
        })
      return
    } else if (query.hasOwnProperty('intro')) {
      BooksIntro.find({ _id: query.intro })
        .then(r => {
          // r 是数组
          if (r.length) {
            res.json(r[0])
          } else {
            res.json(null)
          }
        })
      return
    }
    // 解析 url 的信息
    // 这是一个很强的函数 (๑¯◡¯๑)~
    urlQuery(query).then(r => {
      res.json(r)
    }).catch(err => {
      log('err', err)
    })
  }
})

router.post('/', (req, res) => {
  const body = req.body
  log('body', body)
  Books.findOne({ tags: body.content })
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      log('err', err)
    })
})

module.exports = router
