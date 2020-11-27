const knex = require('knex')
const supertest = require('supertest')
const { app } = require('../src/app')
const helpers = require('./test-helpers')

describe('User Endpoints', () => {
  let db
  before('Make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect form db', () => db.destroy())
  before('cleanup', () => helpers.cleanTables(db))
  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST user', () => {
    it('responds with an error given an invalid user post', () => {
      const user = {
        username: 'test',
        password: 'PASSWORD1!',
      }
      return supertest(app).post('/api/user/').send(user).expect(400)
    })
  })
})
