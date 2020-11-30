const knex = require('knex')
const supertest = require('supertest')
const { app } = require('../src/app')
const helpers = require('./test-helpers')

describe('Auth Endpoints', () => {
  let db
  before('Make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())
  before('cleanup', () => helpers.cleanTables(db))
  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST login credentials to recieve JWT', () => {
    context('Given incorrect credentials', () => {
      it('returns an error when email is not supplied', () => {
        return supertest(app)
          .post('/api/auth/token')
          .send({ password: 'Password1!' })
          .expect(400, { error: "Missing 'email' in request body" })
      })
      it('returns an error when password is not supplied', () => {
        return supertest(app)
          .post('/api/auth/token')
          .send({ email: 'test@test.com' })
          .expect(400, { error: "Missing 'password' in request body" })
      })
      it('returns an error when the credentials are not found in the db', () => {
        return supertest(app)
          .post('/api/auth/token')
          .send({ email: 'test@tests.com', password: 'Password1!' })
          .expect(400, { error: 'Incorrect email, password or username' })
      })
    })
    context('given correct credentials', () => {
      beforeEach('insert seed data', () => {
        const user = [
          {
            id: 1,
            username: 'test',
            avatar_url: 'https://i.imgur.com/eqaKDBlt.jpg',
            email: 'test@test.com',
            password:
              '$2y$12$kj9i.btsmRjEnad/MSJRKu.t2y/9i0KmRGrXHDLiEd1.t7Ps46I/u',
          },
        ]
        return db.into('users').insert(user)
      })
      it('responds with a JWT token given correct email and password', () => {
        return supertest(app)
          .post('/api/auth/token')
          .send({
            email: 'test@test.com',
            password: 'Password1!',
          })
          .expect(200)
      })
    })
  })
})
