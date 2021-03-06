const express = require('express')
const router = express.Router()
const to = require('await-to-js').default

const Book = require('../model/Book')
const { logger, objectIsEmpty } = require('../utils')

const getPage = async (
  $,
  pageIndex,
  perPage = 10,
  specificField = '_id title info.作者 rating score'
) => {
  if (pageIndex <= 0) {
    pageIndex = 1
  } else {
    const total = await $.countDocuments()
    const maxPage = Math.ceil(total / perPage)
    if (pageIndex > maxPage) {
      return null
    }
  }

  return $.find({})
    .skip((pageIndex - 1) * perPage)
    .limit(perPage)
    .select(specificField)
    .exec()
}

const chainingQueriesFilter = async (cq, query) => {
  // cq stands for chaining queries
  if (query.hasOwnProperty('score')) {
    cq.find({ score: { $gte: Number(query.score) } })
  }
  if (query.hasOwnProperty('count')) {
    return cq.countDocuments()
  }
  // for pagination
  if (query.hasOwnProperty('page')) {
    return getPage(cq, Number(query.page))
  } else {
    return getPage(cq, 1)
  }
}

const fuzzySearch = async query => {
  // for home page search bar

  const cq = Book.find({
    $or: [
      { _id: query.all },
      { tags: { $regex: '.*' + query.all + '.*' } },
      { title: { $regex: '.*' + query.all + '.*' } },
      { 'info.作者': { $regex: '.*' + query.all + '.*' } }
    ]
  })
  return chainingQueriesFilter(cq, query)
}

const categorySearch = async query => {
  // for detail page hyperlink
  const cq = Book.find({})
  if (query.hasOwnProperty('tag')) {
    cq.find({ tags: { $regex: '.*' + query.tag + '.*' } })
  }
  if (query.hasOwnProperty('author')) {
    cq.find({ 'info.作者': { $regex: '.*' + query.author + '.*' } })
  }
  if (query.hasOwnProperty('title')) {
    cq.find({ title: { $regex: '.*' + query.title + '.*' } })
  }
  return chainingQueriesFilter(cq, query)
}

// OrderedDict: e.g. all have highest priority
const queryHandler = {
  async all (_, query) {
    return await fuzzySearch(query)
  },
  async id (_id) {
    return await Book.findOne({ _id }).select('-intro -comments')
  },
  async intro (_id) {
    return await Book.findOne({ _id }).select('intro')
  },
  async last (_, query) {
    return await categorySearch(query)
  }
}

router.get('/', async (req, res) => {
  // No parameters
  if (objectIsEmpty(req.query)) {
    return res.status(404).json({
      msg: 'No parameters'
    })
  }

  // TODO: not found then 404
  // execute query
  try {
    for (const [name, handler] of Object.entries(queryHandler)) {
      if (name === 'last') {
        return res.json(await queryHandler.last(null, req.query))
      }
      if (req.query.hasOwnProperty(name)) {
        const r = await handler(req.query[name], req.query)
        return res.json(r)
      }
    }
  } catch (error) {
    res.status(500).json({
      msg: 'Internal Server Error'
    })
  }
})

router.post('/', async (req, res) => {
  console.log(req.body)
  if (!req.body._id) {
    res.json({
      code: 1,
      msg: 'Book(ISBN) needed'
    })
  }
  // todo: field check
  const b = new Book(req.body)

  const [err, data] = await to(b.save())

  if (err) {
    if (err.code === 11000) {
      res.json({
        code: 1,
        msg: 'Book(ISBN) is existed'
      })
    } else {
      res.json({
        code: 2,
        msg: 'Web Server have problems'
      })
      logger.error('Fail to signup', err)
    }
  } else {
    res.json({
      code: 0,
      msg: 'Create book successfully'
    })
  }
})

router.delete('/', async (req, res) => {
  console.log(req.body)
  const _id = req.body._id
  if (!_id) {
    res.json({
      code: 1,
      msg: 'Book(ISBN) needed'
    })
  }

  const [err, data] = await to(
    Book.findOne({
      _id
    })
  )
  if (!data) {
    res.json({ code: 2, msg: 'book non-exsits' })
  }

  await to(Book.findOneAndDelete({ _id: _id }))

  if (err) {
    // todo, determine specif err
    res.json({
      code: 1,
      msg: 'Web Server have problems'
    })
    logger.error('Fail to delete', err)
  } else {
    res.json({
      code: 0,
      msg: 'ok'
    })
  }
})

module.exports = router
