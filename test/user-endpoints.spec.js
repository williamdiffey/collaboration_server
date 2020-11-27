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
  before('cleanup', () => helpers.cleanUserTable(db))
  afterEach('cleanup', () => helpers.cleanUserTable(db))

  describe('POST user', () => {
    it('responds with an error given an invalid user post', () => {
      const user = {
        username: 'test',
        password: 'PASSWORD1!',
      }
      return supertest(app).post('/api/user/').send(user).expect(400)
    })
    it('responds with 201 and the json data given a valid request', () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
        password: 'Password1!',
      }

      const expected = {
        id: 1,
        email: 'test@test.com',
        username: 'test',
      }
      return supertest(app)
        .post('/api/user')
        .send(user)
        .expect(201, expected)
        .expect('Content-Type', /json/)
    })
  })

  describe('GET user', () => {
    context('given there is a user in the db', () => {
      beforeEach('insert seed data', () => {
        const user = [
          {
            username: 'test',
            avatar_url: 'https://i.imgur.com/eqaKDBlt.jpg',
            email: 'test@test.com',
            password:
              '$2y$12$R6sg9E77/5c41GJZIGqlH.UH73UPmxFwa6S6U1DMvA4MjSgIyGtVG',
          },
        ]
        return db.into('users').insert(user)
      })
      it('responds with the user', () => {
        const expected = {
          userInfo: {
            id: 1,
            username: 'test',
            avatar_url: 'https://i.imgur.com/eqaKDBlt.jpg',
            email: 'test@test.com',
          },
        }
        return supertest(app).get('/api/user/1').expect(200, expected)
      })
    })
  })
})
