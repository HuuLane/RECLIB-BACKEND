const { createLogger, transports, format } = require('winston')
require('winston-daily-rotate-file')

// transport.on('rotate', (oldFilename, newFilename) => {})

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.simple()
    //
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: './logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info'
      // level: process.env.ENV === 'production' ? 'info' : 'debug'
    })
  ]
})

const registerLogger = app => {
  const fs = require('fs')
  const morgan = require('morgan')
  const path = require('path')
  // create a write stream (in append mode)
  const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'logs/access.log'),
    { flags: 'a' }
  )

  // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }))
}

const objectIsEmpty = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

module.exports = {
  logger,
  registerLogger,
  objectIsEmpty
}
