const express = require('express')
const asyncHandler = require('express-async-handler')
const router = express.Router()

const { Books, BooksIntro } = require('../db')
const { logger, objectIsEmpty } = require('../utils')

const getPage = async (
  $,
  pageIndex,
  perPage,
  specificField = '_id title info.作者 rating score'
) => {
  // default result 10
  perPage = Number(perPage) || 10
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
    return getPage(cq, query.page)
  } else {
    return getPage(cq, 1)
  }
}

const fuzzySearch = async query => {
  // for home page search bar

  const cq = Books.find({
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
  const cq = Books.find({})
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
    return await Books.findOne({ _id })
  },
  async intro (_id) {
    return await BooksIntro.findOne({ _id })
  },
  async last (_, query) {
    return await categorySearch(query)
  }
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    // No parameters
    if (objectIsEmpty(req.query)) {
      return res.status(404).json({
        msg: 'No parameters'
      })
    }

    // TODO: not found then 404
    // execute query
    for (const [name, handler] of Object.entries(queryHandler)) {
      if (name === 'last') {
        return res.json(await queryHandler.last(null, req.query))
      }
      if (req.query.hasOwnProperty(name)) {
        const r = await handler(req.query[name], req.query)
        return res.json(r)
      }
    }
  })
)

module.exports = router
