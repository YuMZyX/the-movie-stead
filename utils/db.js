const { Sequelize } = require('sequelize')
const config = require('./config')
const logger = require('./logger')

const sequelize = new Sequelize(config.DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    logger.info('database connected')
  } catch (error) {
    logger.error('connecting to database failed: ', error.message)
    return process.exit(1)
  }
  return null
}

module.exports = { connectToDatabase, sequelize }