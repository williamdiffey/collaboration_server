'use strict'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

const AuthService = {
  getUserWithUserName(db, username) {
    return db('users').where({ username }).first()
  },
  getUserWithEmail(db, email) {
    return db('users').where({ email }).orWhere('username', email).first()
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash)
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, config.JWT_SECRET, {
      subject,
      expiresIn: config.JWT_EXPIRY,
      algorithm: 'HS256',
    })
  },
  verifyJwt(token) {
    return jwt.verifyu(token, config.JWT_SECRET, {
      algorithms: ['HS256'],
    })
  },
}

module.exports = AuthService
