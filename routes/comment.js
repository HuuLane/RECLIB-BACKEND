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

  new Comment({
    user: uid,
    book: bookID,
    content
  })
    .save()
    .then(() => {
      res.json({ code: 1, msg: 'Comment successful' })
    })
    .catch(error => {
      logger.error('comment', error)
      res.json({ code: 5, msg: 'An error occurred in the database' })
    })
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

router.put('/:id', async (req, res) => {
  const id = req.params.id
  const { name, uid } = req.session
  const { content } = req.body

  const c = await Comment.findById(id)

  if (!c) {
    return res.json({ code: 4, msg: 'no the comment' })
  }

  if (c.user.toString() !== uid) {
    return res.json({
      code: 3,
      msg: 'user only able to edit his/her own comments'
    })
  }

  c.edited = true
  c.content = content
  c.save()
    .then(() => {
      res.json({ code: 1, msg: 'edit the comment successfully' })
    })
    .catch(error => {
      logger.error('edit a comment', error)
      res.json({ code: 5, msg: 'An error occurred in the database' })
    })
})

router.delete('/:id', async (req, res) => {
  const { name, uid } = req.session

  const c = await Comment.findById(id)

  if (!c) {
    return res.json({ code: 4, msg: 'no the comment' })
  }

  if (c.user.toString() !== uid) {
    return res.json({
      code: 3,
      msg: 'user only able to delete his/her own comments'
    })
  }

  c.deleted = true
  c.save()
    .then(() => {
      res.json({ code: 1, msg: 'delete the comment successfully' })
    })
    .catch(error => {
      logger.error('delete a comment', error)
      res.json({ code: 5, msg: 'An error occurred in the database' })
    })
})

module.exports = router
