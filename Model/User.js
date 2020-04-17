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
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }
    ],
    date: {
      type: Date,
      // `Date.now()` returns the current unix timestamp as a number
      // Mongoose will cast the value to a native JavaScript date using the Date() constructor.
      default: Date.now
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
  const hash = await bcrypt.hash(this.password, saltRounds)
  // override the cleartext password with the hashed one
  this.password = hash
  next()
})

schema.pre('save', async function (next) {
  // for user index
  const counter = await Counter.findOneAndUpdate(
    { _id: 'forUserIndex' },
    { $inc: { seq: 1 } },
    // https://stackoverflow.com/a/30396464/11487798
    { upsert: true, new: true }
  )
  this.index = counter.seq
  next()
})

schema.methods.comparePasswd = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', schema, 'user')
