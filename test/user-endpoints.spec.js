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
    it('responds with an error given a missing field', () => {
      const user = {
        username: 'test',
        password: 'PASSWORD1!',
      }
      return supertest(app).post('/api/user/').send(user).expect(400)
    })
    it('responds with 201 and the json data given a valid request', () => {
      const user = {
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
    it('responds with an error if the password is too short', () => {
      const user = {
        email: 'test@test.com',
        username: 'test',
        password: 'Pass',
      }

      return supertest(app).post('/api/user').send(user).expect(400, {
        passwordError: 'Password must be at least 6 characters in length',
      })
    })
    it('responds with an error if the password is too long', () => {
      const user = {
        email: 'test@test.com',
        username: 'test',
        password:
          'Passssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
      }

      return supertest(app).post('/api/user').send(user).expect(400, {
        passwordError: 'Password must be less than 30 characters in length',
      })
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
            username: 'test',
            id: 1,
            avatar_url: 'https://i.imgur.com/eqaKDBlt.jpg',
            email: 'test@test.com',
          },
        }
        return supertest(app).get('/api/user/1').expect(200, expected)
      })
    })
    context('given there is a malicious entry in the user db', () => {
      beforeEach('insert seed data', () => {
        const user = [
          {
            username: '<script>test</script>',
            avatar_url: 'https://i.imgur.com/eqaKDBlt.jpg',
            email: 'test@test.com',
            password:
              '$2y$12$R6sg9E77/5c41GJZIGqlH.UH73UPmxFwa6S6U1DMvA4MjSgIyGtVG',
          },
        ]
        return db.into('users').insert(user)
      })
      it('responds with a santised version of the input', () => {
        const expected = {
          userInfo: {
            username: '<script>test</script>',
            id: 1,
            avatar_url: 'https://i.imgur.com/eqaKDBlt.jpg',
            email: 'test@test.com',
          },
        }
        return supertest(app).get('/api/user/1').expect(200, expected)
      })
    })
  })
  describe('PATCH user', () => {
    context('given no bearer token', () => {
      it('returns an error', () => {
        return supertest(app)
          .patch('/api/user/1')
          .expect(401, { error: 'Missing bearer token' })
      })
    })
    context('given there is nothing to update', () => {
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
      it('responds with an error', () => {
        return supertest(app)
          .patch('/api/user/1')
          .set('authorization', `bearer ${process.env.TEST_BEARER_TOKEN}`)
          .expect(400, { error: 'No new information provided' })
      })
    })
  })
})
