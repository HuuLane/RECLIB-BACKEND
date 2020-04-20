const mongoose = require('mongoose')
const env = require('env-var')
const { logger } = require('./utils')

const connetDB = dbName => {
  const HOST = env
    .get('MONGO_HOST')
    .default('localhost')
    .asString()
  const url = `mongodb://${HOST}:27017/${dbName}`

  mongoose.connect(url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    auto_reconnect: true
  })
  const db = mongoose.connection
  db.on('error', error => {
    logger.error('Error in MongoDb connection: ', error)
    mongoose.disconnect()
  })
  db.on('connected', function () {
    logger.info('MongoDB connected!')
  })
  return db
}

const model = (modelName, collectionName, properties, methods = {}) => {
  const schema = new mongoose.Schema(properties, {
    // disable mongoose auto-inserted _v filed
    versionKey: false
  })
  // add methods
  for (const [methodNane, method] of Object.entries(methods)) {
    schema.statics[methodNane] = method
  }
  // compiling schema into a Model.
  return mongoose.model(modelName, schema, collectionName)
}

const db = connetDB('doubanBook')

const Counter = model('Counter', 'counter', {
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
})

module.exports = {
  db,
  Counter
}
