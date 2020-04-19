const session = require('express-session')
const redis = require('redis')
const redisClient = redis.createClient()
const redisStore = require('connect-redis')(session)

redisClient.on('error', err => {
  console.log('Redis error: ', err)
})

// Start a session; we use Redis for the session store.
// "secret" will be used to create the session ID hash (the cookie id and the redis key value)
// "name" will show up as your cookie name in the browser
// "cookie" is provided by default; you can add it to add additional personalized options
// The "store" ttl is the expiration time for each Redis session ID, in seconds
module.exports = session({
  secret: '32471ae5cdc2c4541952c359a66526fd',
  name: 'sid',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new redisStore({
    client: redisClient,
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
    ttl: 86400
  })
})
