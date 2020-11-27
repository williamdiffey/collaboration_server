require('dotenv').config()

module.exports = {
  migrationDirectory: 'migrations',
  driver: 'pg',
  connectionString: process.env.TEST_DB_URL,
}
