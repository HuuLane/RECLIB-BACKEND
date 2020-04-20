const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
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
  const doc = this
  if (!doc.isModified('password')) {
    return next()
  }
  return new Promise((res, rej) => {
    bcrypt.genSalt(9, function (err, salt) {
      bcrypt.hash(doc.password, salt, function (err, hash) {
        if (err) {
          logger.error(err)
          rej(err)
        }
        console.log(hash)
        // override the cleartext password with the hashed one
        doc.password = hash
        res(next())
      })
    })
  })
})

schema.methods.comparePasswd = async function (candidatePassword) {
  const doc = this
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, doc.password, function (err, res) {
      // res === true
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

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

module.exports = mongoose.model('User', schema, 'user')
