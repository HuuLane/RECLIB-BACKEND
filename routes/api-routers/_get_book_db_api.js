// 引入数据库
// eslint-disable-next-line
const { Books, BooksIntro } = require('../../src/db-utils')

const getPage = async ($, pageIndex, perPage, specificField = '_id title info.作者 rating score') => {
  // 默认显示 10条
  perPage = Number(perPage) || 10
  if (pageIndex <= 0) {
    pageIndex = 1
  } else {
    // 所有记录的数量
    const count = await $.countDocuments()
    // 最大页数
    const maxPage = Math.ceil(count / perPage)
    // 超标则设置为最大页数
    if (pageIndex > maxPage) {
      return null
    }
  }
  return $.find({}).skip((pageIndex - 1) * perPage).limit(perPage).select(specificField).exec()
}

module.exports = {
  getPage
}
