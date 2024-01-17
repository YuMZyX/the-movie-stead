const { defineConfig } = require('cypress')
const helper = require('./utils/test_helper')

module.exports = defineConfig({
  video: false,
  e2e: {
    setupNodeEvents(on, config) { //eslint-disable-line no-unused-vars
      on('task', {
        'db:seedUsers': async () => {
          await helper.seedUsers()
          return null
        }
      })
    },
    baseUrl: (process.platform === 'win32')
      ? 'http://localhost:5173'
      : 'http://localhost:3001'
  },
  env: {
    BACKEND: (process.platform === 'win32')
      ? 'http://localhost:5173/api'
      : 'http://localhost:3001/api'
  }
})