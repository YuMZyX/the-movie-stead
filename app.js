const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const usersRouter = require('./controllers/users')

app.use(cors())
app.use(express.json())
//app.use(express.static('dist'))

app.get('/test', (req, res) => {
  res.send('test')
})

app.use('/api/users', usersRouter)

module.exports = app