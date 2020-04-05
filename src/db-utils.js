const mongoose = require('mongoose')

const connetDB = dbName => {
  const url = `mongodb://localhost:27017/${dbName}`
  mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, "MongoDB's connection is err!"))
  db.once('open', console.log.bind(console, 'MongoDB is connected!'))
  return db
}

const model = (modelName, collectionName, properties, methods = {}) => {
  const schema = new mongoose.Schema(properties, {
    // disable mongoose auto-inserted _v filed
    versionKey: false
  })
  // add methods
  for (const [methodNane, method] of Object.entries(methods)) {
    schema[methodNane] = method
  }
  // compiling schema into a Model.
  return mongoose.model(modelName, schema, collectionName)
}

const db = connetDB('doubanBook')
// book collection
const Books = model('Books', 'brief', {
  _id: String,
  score: Number,
  rating: Number,
  title: String,
  tags: Array,
  imgUrl: String,
  info: Object
})

const BooksIntro = model('BooksIntro', 'intro', {
  _id: String,
  intro: Array
})

// user collection
const User = model('User', 'registeredUser', {
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
    required: true,
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
})

// stock & commit collection
const StockAndCommit = model('StockAndCommit', 'stocks', {
  _id: String,
  stock: {
    type: Object
  },
  comments: {
    type: Array
  }
})

module.exports = {
  db,
  Books,
  BooksIntro,
  User,
  StockAndCommit
}
