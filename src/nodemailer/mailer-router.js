require('dotenv').config()
const express = require('express')
// const app = express()
const UserService = require('../user/user-service')
const jwt = require('jsonwebtoken')
const mailerRouter = express.Router()

mailerRouter.get('/:token', async (req, res) => {
  try {
    const db = req.app.get('db')
    const EMAIL_SECRET = process.env.EMAIL_SECRET
    const { user } = jwt.verify(req.params.token, EMAIL_SECRET)
    await UserService.updateUser(db, user, { not_verified: false })
  } catch (error) {
    res.send('error')
  }
  res.send('ok')
})
module.exports = mailerRouter
