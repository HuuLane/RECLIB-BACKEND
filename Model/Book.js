const mongoose = require('mongoose')
const { logger } = require('../utils')

const schema = new mongoose.Schema(
  {
    _id: String,
    score: Number,
    rating: Number,
    title: String,
    tags: [String],
    imgUrl: String,
    info: Object,
    intro: [String, String],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    stock: {
      total: Number,
      loanout: [mongoose.Schema.Types.ObjectId]
    }
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('Book', schema, 'books')
