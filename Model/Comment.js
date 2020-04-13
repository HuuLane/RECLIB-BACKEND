const mongoose = require('mongoose')
const { logger } = require('../utils')
const User = require('../Model/User')
const BookExtra = require('../Model/BookExtra')

const schema = new mongoose.Schema(
  {
    bookID: {
      type: String
    },
    uid: {
      type: mongoose.Schema.Types.ObjectId
    },
    content: {
      type: String,
      required: true
    },
    edited: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now()
    }
  },
  {
    versionKey: false
  }
)

schema.pre('save', async function (next) {
  await Promise.all([
    User.findByIdAndUpdate(this.uid, {
      $push: { 'activity.comments': this._id }
    }),
    BookExtra.findByIdAndUpdate(
      this.bookID,
      { $push: { comments: this._id } },
      { upsert: true, new: true }
    )
  ])
  next()
})

schema.statics.getByBookID = async function (bookID) {
  const b = await BookExtra.findById(bookID)
  if (!b) {
    return null
  }
  return await this.find()
    .where('_id')
    .in(b.comments)
    .exec()
}

schema.methods.edit = async function () {
  // TODO
}

module.exports = mongoose.model('Comment', schema, 'comments')
