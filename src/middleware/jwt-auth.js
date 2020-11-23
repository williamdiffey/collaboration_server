const { JsonWebTokenError } = require('jsonwebtoken')
const AuthService = require('../auth/auth-service')

async function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let bearerToken
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  } else {
    bearerToken = authToken.split(' ')[1]
  }

  try {
    const payload = AuthService.verifyJwt(bearerToken)
    const user = await AuthService.getUserWithEmail(
      req.app.get('db'),
      payload.email,
    )

    if (!user)
      return res.status(401).json({ error: 'You must be logged in to do that' })

    req.user = user
    next()
  } catch (error) {
    if (error instanceof JsonWebTokenError)
      return res.status(401).json({ error: 'You must be logged in to do that' })
    next(error)
  }
}

async function requireSocketAuth(db, authToken) {
  try {
    const payload = AuthService.verifyJwt(authToken)
    const user = await AuthService.getUserWithEmail(db, payload.email)
    if (!user) {
      throw new Error('Unaithorized Requests')
    }
    return user.id
  } catch (error) {
    throw new Error('Unauthorized request')
  }
}

module.exports = {
  requireAuth,
  requireSocketAuth,
}
