const logger = require('pino')()

if (process.env.NODE_ENV === 'PROD') {
  logger.level = 'info'
} else {
  logger.level = 'trace'
}

const registerLogger = app => {
  const pino = require('pino-http')()
  app.use(pino)
}

module.exports = {
  logger,
  registerLogger
}
