require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')

const app = express()
const authRouter = require('./auth/auth-router')
const userRouter = require('./user/user-router')
const mailerRouter = require('./nodemailer/mailer-router')

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common'

const server = require('http').Server(app)

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/confirmation', mailerRouter)

app.get('/', (req, res) => {
  res.send('Welcome to the Collaborate Server')
})

// app.use(errorHandler)
app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'Server Error' } }
  } else {
    console.error(error)
    response = { message: error.message, error }
  }
  res.status(500).json(response)
})

module.exports = {
  server,
  app,
}
