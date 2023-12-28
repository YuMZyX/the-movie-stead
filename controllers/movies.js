const router = require('express').Router()
const config = require('../utils/config')
const { MovieDb } = require('moviedb-promise')

const moviedb = new MovieDb(config.TMDB_APIKEY)

router.get('/trending/:page', async (req, res) => {
  const trendingMovies = await moviedb.trending({
    media_type: 'movie',
    time_window: 'week',
    page: req.params.page
  })
  return res.json(trendingMovies)
})

router.get('/:id', async (req, res) => {
  const movie = await moviedb.movieInfo({
    id: req.params.id,
    append_to_response: 'credits'
  })
  return res.json(movie)
})

router.get('/:id/credits', async (req, res) => {
  const movieCredits = await moviedb.movieCredits(req.params.id)
  return res.json(movieCredits)
})

module.exports = router