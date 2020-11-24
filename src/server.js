require('dotenv').config

const knex = require('knex')
const { PORT, DB_URL } = require('./config')
const { server, app } = require('./app')

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

server.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
