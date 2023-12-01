require('dotenv').config()

const API_KEY = process.env.TMDB_APIKEY
const PORT = process.env.PORT || 3001
const DATABASE_URL = process.env.DATABASE_URL
const BACKEND_URL = process.env.BACKEND_URL

module.exports = {
  API_KEY,
  PORT,
  DATABASE_URL,
  BACKEND_URL,
}
