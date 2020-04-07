const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Counter } = require('../db')
const { logger } = require('../utils')
const saltRounds = 9

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
    index: {
      type: Number,
      unique: true
    },
    activity: {
      type: Object,
      rentBook: [Array],
      comments: [Array]
    },
    date: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      default: Date.now()
    }
  },
  {
    // disable mongoose auto-inserted _v filed
    versionKey: false
  }
)

schema.pre('save', async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next()
  }
  logger.info('before sign up hash')
  const hash = await bcrypt.hash(this.password, saltRounds)
  logger.info('sign up hash', hash)
  // override the cleartext password with the hashed one
  this.password = hash
  next()
})

schema.pre('save', async function (next) {
  // for user index
  const counter = await Counter.findOneAndUpdate(
    { _id: 'forUserIndex' },
    { $inc: { seq: 1 } },
    { upsert: true }
  )
  this.index = counter.seq
  next()
})

schema.methods.comparePasswd = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', schema, 'user')
