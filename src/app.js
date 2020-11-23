require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require('./middleware/error-handler')

const app = express()
const authRouter = require('./auth/auth-router')

const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganOption))
app.use(cors())
app.use(helmet())
// app.use(validateBearerToken)

app.use(boilerplateRouter)

app.get('/', (req, res) => {
  res.send('Welcome to the Collaborate Server')
})

app.use(errorHandler)

module.exports = app
