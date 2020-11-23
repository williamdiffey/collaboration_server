const { NODE_ENV } = require('../config')

module.exports = function errorHandler(error, req, res) {
  const response =
    NODE_ENV === 'production'
      ? { error: 'Server Error' }
      : (console.error(error), { error: error.message, details: error })

  res.status(500).json(response)
}
