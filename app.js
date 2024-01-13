const express = require('express')
require('express-async-errors')
const path = require('path')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')

const usersRouter = require('./controllers/users')
const sessionsRouter = require('./controllers/sessions')
const watchlistRouter = require('./controllers/watchlists')
const moviesRouter = require('./controllers/movies')
const starsRouter = require('./controllers/stars')
const reviewsRouter = require('./controllers/reviews')

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)

app.use(express.static(path.join(__dirname, 'dist')))

app.use('/api/users', usersRouter)
app.use('/api', sessionsRouter)
app.use('/api/watchlists', watchlistRouter)
app.use('/api/movies', moviesRouter)
app.use('/api/stars', starsRouter)
app.use('/api/reviews', reviewsRouter)

app.get('/test', (req, res) => {
  res.send('test')
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app