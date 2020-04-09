const mongoose = require('mongoose')
const { logger } = require('../utils')

const schema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.ObjectId,
      required: true
    },
    book: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      unique: true
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
