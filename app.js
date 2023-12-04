const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')

const usersRouter = require('./controllers/users')
const sessionsRouter = require('./controllers/sessions')

app.use(cors())
app.use(express.json())
//app.use(express.static('dist'))

app.use(middleware.requestLogger)

app.get('/test', (req, res) => {
  res.send('test')
})

app.use('/api/users', usersRouter)
app.use('/api', sessionsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app