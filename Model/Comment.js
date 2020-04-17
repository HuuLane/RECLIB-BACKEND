const mongoose = require('mongoose')
const { logger } = require('../utils')
const User = require('../Model/User')
const Book = require('../Model/Book')

const schema = new mongoose.Schema(
  {
    book: {
      type: String,
      ref: 'Book'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true
    },
    edited: {
      type: Boolean,
      default: false
    },
    deleted: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
)

schema.pre('save', async function (next) {
  if (!this.isNew) {
    return next()
  }
  await Promise.all([
    User.findByIdAndUpdate(this.user, {
      $push: { comments: this._id }
    }),
    Book.findByIdAndUpdate(this.book, { $push: { comments: this._id } })
  ])
  next()
})

schema.statics.getByBookID = async function (bookID) {
  return await Book.findById(bookID)
    .populate({
      path: 'comments',
      select: '-book',
      populate: { path: 'user', select: 'name' }
    })
    .select('comments')
}

schema.statics.getByUserID = async function (uid) {
  return await User.findById(uid)
    .populate({
      path: 'comments',
      select: '-user',
      populate: { path: 'book', select: 'title' }
    })
    .select('comments')
}

schema.methods.edit = async function () {
  // TODO
}

module.exports = mongoose.model('Comment', schema, 'comments')
