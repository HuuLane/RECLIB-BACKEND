const winston = require('winston')
const expressWinston = require('express-winston')

const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
})

const registerLogger = app => {
  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
      // meta: true, // optional: control whether you want to log the meta data about the request (default to true)
      // msg: 'HTTP {{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}', // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
      expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
      colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
      ignoreRoute: function (req, res) {
        return false
      } // optional: allows to skip some log messages based on request and/or response
    })
  )
}

const objectIsEmpty = obj => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

module.exports = {
  logger,
  registerLogger,
  objectIsEmpty
}
