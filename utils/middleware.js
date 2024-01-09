const jwt = require('jsonwebtoken')
const config = require('./config')
const logger = require('./logger')
const { User, Session } = require('../models')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'Malformatted data or incorrect type' })
  } else if (error.name ===  'JsonWebTokenError') {
    return res.status(401).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }

  next(error)
}

const sessionCheck = async (token) => {
  return await Session.findOne({
    where: {
      token: token
    },
    include: {
      model: User
    }
  })
}

const userExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Token missing' })
  }

  try {
    jwt.verify(authorization.substring(7), config.JWT_SECRET)
  } catch (error) {
    console.log(error)
    return res.status(401).json({ error: 'Token invalid or expired' })
  }

  const session = await sessionCheck(authorization.substring(7))

  if (!session) {
    return res.status(401).json({ error: 'Session not found, please login again' })
  } else if (session.user.disabled) {
    await Session.destroy({
      where: {
        userId: session.user.id
      }
    })
    return res.status(401).json({ error: 'Account disabled, contact admin/moderator' })
  }

  req.user = session.user

  next()
}

const moderatorExtractor = async (req, res, next) => {
  userExtractor(req, res, () => {
    if (req.user.role !== 'moderator' || req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Not allowed to access this content' })
    }
  })
  next()
}

const adminExtractor = async (req, res, next) => {
  userExtractor(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ error: 'Not allowed to access this content' })
    }
  })
  next()
}

module.exports = {
  errorHandler,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  moderatorExtractor,
  adminExtractor
}