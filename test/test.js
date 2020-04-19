// const expect = require('expect.js')
// const bcrypt = require('bcrypt')

// describe('Utils', async function () {
//   describe('#bcryptHashPasswdCompare()', function () {
//     let hash = ''
//     let passwd = 'this.password'
//     before('generate hash', async function () {
//       hash = await bcrypt.hash(passwd, 9)
//       // console.log(hash)
//     })
//     it('should return true when the password is the same', async function () {
//       const r = await bcrypt.compare(passwd, hash)
//       expect(r).to.be(true)
//     })
//     it('should return false when the password is not the same', async function () {
//       const r = await bcrypt.compare('thispassword', hash)
//       expect(r).to.be(false)
//     })
//   })
// })
