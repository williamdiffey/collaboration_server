'use strict'

const bcrypt = require('bcryptjs')
const xss = require('xss')

const REGEX_UPPER_LOWER_NUMBER_NONALPHA = /(?=.*\W)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[\S]+/

const UserService = {
  hasUserWithUserName(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then((user) => !!user)
  },
  hasUserWithEmail(db, email) {
    return db('users')
      .where({ email })
      .first()
      .then((user) => !!user)
  },
  getUserId(db, username) {
    return db.from('users').select('id').where({ username })
  },
  getUserInfo(db, userId) {
    return db
      .from('users')
      .select('id', 'username', 'avatar_url', 'email')
      .where('id', userId)
      .first()
  },
  updateUser(db, userId, userInfo) {
    return db.from('users').where('id', userId).update(userInfo)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },
  validatePassword(password) {
    if (password.length < 6) {
      return 'Password must be at least 6 characters in length'
    }
    if (password.length > 30) {
      return 'Password must be less than 30 characters in length'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start of end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_NONALPHA.test(password)) {
      return 'Password must contain at least 1 uppercase, lowercase, symbol and number'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      username: xss(user.username),
      email: xss(user.email),
    }
  },
}

module.exports = UserService
