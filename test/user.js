const app = require('../app')
const request = require('supertest')

describe('API /user', function () {
  it.skip('POST to create user', function (done) {
    request(app)
      .post('/user')
      .send('email=test@abc.com&name=test&password=1234')
      .set('Accept', 'application/json')
      .expect(
        200,
        {
          code: 1,
          msg: 'Create account successfully'
        },
        done
      )
  })
  it.skip('DELETE to delete user', function (done) {
    // TODO
  })
})
