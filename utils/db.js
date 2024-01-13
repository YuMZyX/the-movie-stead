const { Sequelize } = require('sequelize')
const config = require('./config')
const logger = require('./logger')
const { Umzug, SequelizeStorage } = require('umzug')
require('dotenv').config()

const sequelize = process.env.NODE_ENV === 'test'
  ? new Sequelize(config.TEST_DATABASE_URL, { logging: false })
  : new Sequelize(config.DATABASE_URL)

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name)
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    logger.info('database connected')
  } catch (error) {
    logger.error('connecting to database failed: ', error.message)
    return process.exit(1)
  }
  return null
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }