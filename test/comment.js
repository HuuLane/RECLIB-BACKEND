const app = require('../app')
const request = require('supertest')
const assert = require('assert')

describe('API /comment', function () {
  const agent = request.agent(app)

  before('login to get session', function (done) {
    agent
      .post('/login')
      .send('email=test@abc.com&password=1234')
      .set('Accept', 'application/json')
      .expect(200, { code: 1, msg: 'login successful', userName: 'test' }, done)
  })

  it('Should login first', function (done) {
    request(app)
      .post('/comment')
      .send('id=9780201498400&content=thanks')
      .set('Accept', 'application/json')
      .expect(200, { code: 0, msg: 'No login' }, done)
  })

  it('POST to make a comment', function (done) {
    agent
      .post('/comment')
      .send('id=9780201498400&content=thanks')
      .set('Accept', 'application/json')
      .expect(200, { code: 1, msg: 'Comment successful' }, done)
      .retry(3)
  })

  it('GET all comments', function (done) {
    agent
      .get('/comment/9780201498400')
      .set('Accept', 'application/json')
      .expect(200)
      .then(r => {
        // console.log(r)
        done()
      })
  })

  it.skip('DELETE to comment', function (done) {
    // TODO
  })
})
