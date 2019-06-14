const mongoose = require('mongoose')

const connetDB = (dbName) => {
  const url = `mongodb://localhost:27017/${dbName}`
  mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true })
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'MongoDB 连接错误：'))
  db.once('open', console.log.bind(console, 'MongoDB开始工作！'))
  return db
}
const model = (modelName, collectionName, schema) => {
  const _schema = new mongoose.Schema(schema, {
    // mongoose 会自动插入 _v字段, 设为 false 取消
    versionKey: false
  })
  return mongoose.model(modelName, _schema, collectionName)
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
    required: true
  }
})

module.exports = {
  db,
  Books,
  BooksIntro,
  User
}
