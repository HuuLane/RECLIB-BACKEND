const Book = require('../Model/Book')
const Comment = require('../Model/Comment')

const { logger } = require('../utils')
const router = require('express').Router()

router.post('/', async (req, res) => {
  const { name, uid } = req.session
  if (!name) {
    return res.json({ code: 0, msg: 'No login' })
  }
  const { id: bookID, content } = req.body

  if (!(await Book.exists({ _id: bookID }))) {
    return res.json({ code: 4, msg: 'no the book' })
  }

  try {
    const c = new Comment({
      user: uid,
      book: bookID,
      content
    })
    await c.save()
    res.json({ code: 1, msg: 'Comment successful' })
  } catch (error) {
    logger.error('comment', error)
    res.json({ code: 5, msg: 'An error occurred in the database' })
  }
})

router.get('/', async (req, res) => {
  const { book, user } = req.query
  if (book) {
    const r = await Comment.getByBookID(book)
    res.json({ code: 1, msg: 'Get comments successful', comments: r.comments })
  } else if (user) {
    const r = await Comment.getByUserID(user)
    res.json({
      code: 1,
      msg: 'Get comments successful',
      comments: r.activity.comments
    })
  } else {
    return res.json({ code: 2, msg: 'No parameters' })
  }
})

module.exports = router
