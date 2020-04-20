const expect = require('expect.js')

// TODO: this unit test is expired, migrate from bcrypt to bcryptjs
// describe('Utils', async function () {
// const bcrypt = require('bcrypt')
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

describe('Utils', async function () {
  describe('#env-var', function () {
    const env = require('env-var')
    it('should throw error when no the required env var', async function () {
      expect(function () {
        const PASSWORD = env
          .get('DB_PASSWORD')
          .required()
          .asString()
        console.log(PASSWORD)
      }).to.throwError(err => {
        console.log(err)
      })
    })
    it('should have the default env var', function () {
      const PASSWORD = env
        .get('DB_PASSWORD')
        .default('TEST123')
        .asString()
      expect(PASSWORD).eql('TEST123')
    })
    it('should read the env var correctly', function () {
      process.env.DB_PASSWORD = 'TEST123'
      const PASSWORD = env
        .get('DB_PASSWORD')
        .required()
        .asString()
      expect(PASSWORD).eql('TEST123')
    })
  })
})
