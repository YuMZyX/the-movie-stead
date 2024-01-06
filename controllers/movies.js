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

router.get('/search/:query&:page', async (req, res) => {
  const movies = await moviedb.searchMovie({
    query: req.params.query,
    page: req.params.page
  })
  return res.json(movies)
})

router.get('/discover/:query&:page', async (req, res) => {
  const movies = await moviedb.discoverMovie({
    with_release_type: 2,
    'vote_count.gte': 10,
    with_genres: req.params.query.genres
  })
  return res.json(movies)
})

// REMOVE IF NO LONGER RELEVANT
router.get('/:id/credits', async (req, res) => {
  const movieCredits = await moviedb.movieCredits(req.params.id)
  return res.json(movieCredits)
})

module.exports = router