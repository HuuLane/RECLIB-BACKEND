const mongoose = require('mongoose')
const { logger } = require('../logger')

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
    ]
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('Book', schema, 'books')
