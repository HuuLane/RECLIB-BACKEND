const { Books } = require('../db')
const Comment = require('../Model/Comment')

const { logger } = require('../utils')
const router = require('express').Router()

router.post('/', async (req, res) => {
  const { name, uid } = req.session
  if (!name) {
    return res.json({ code: 0, msg: 'No login' })
  }
  const { id: bookID, content } = req.body

  // retrive book
  const b = await Books.findOne({ _id: bookID })
  if (!b) {
    return res.json({ code: 4, msg: 'no the book' })
  }

  try {
    const c = new Comment({
      uid,
      bookID,
      content
    })
    await c.save()
    res.json({ code: 1, msg: 'Comment successful' })
  } catch (error) {
    logger.error('comment', error)
    res.json({ code: 5, msg: 'An error occurred in the database' })
  }
})

router.get('/:bookID', async (req, res) => {
  // TODO get all of comments of a user
  const _id = req.params.bookID
  if (!_id) {
    return res.json({ code: 2, msg: 'No parameters' })
  }
  const r = await Comment.getByBookID(_id)
  if (r) {
    res.json({ code: 1, msg: 'Get comments successful', comments: r })
  } else {
    res.json({ code: 0, msg: 'No comments' })
  }
})

module.exports = router
