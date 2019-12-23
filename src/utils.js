const log = console.log.bind(console)

const objectIsEmpty = (obj) => {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

module.exports = {
  log,
  objectIsEmpty
}
