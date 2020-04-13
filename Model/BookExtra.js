const mongoose = require('mongoose')
const { logger } = require('../utils')

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },
    comments: [mongoose.Schema.Types.ObjectId],
    stock: {
      total: Number,
      loanout: [mongoose.Schema.Types.ObjectId]
    }
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('BookExtra', schema, 'bookExtra')
