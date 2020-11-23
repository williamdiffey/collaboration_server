
const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "Hello Uncle Leo!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Hello Uncle Leo')
  })
})