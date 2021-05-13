if (process.env.NODE_ENV === 'production') {
  module.exports = require('./private.prod')
} else {
  module.exports = require('./private.dev')
}

