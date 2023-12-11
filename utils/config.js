require('dotenv').config()

const TMDB_APIKEY = process.env.TMDB_APIKEY
const PORT = process.env.PORT || 3001
const DATABASE_URL = process.env.DATABASE_URL
const BACKEND_URL = process.env.BACKEND_URL
const JWT_SECRET = process.env.JWT_SECRET

module.exports = {
  TMDB_APIKEY,
  PORT,
  DATABASE_URL,
  BACKEND_URL,
  JWT_SECRET,
}
