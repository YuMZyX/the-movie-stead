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
  res.json(trendingMovies)
})

router.get('/genres', async (req, res) => {
  const genres = await moviedb.genreMovieList()
  res.json(genres)
})

router.get('/toprated', async (req, res) => {
  const topRatedMovies = await moviedb.movieTopRated()
  res.json(topRatedMovies)
})

router.get('/:id', async (req, res) => {
  const movie = await moviedb.movieInfo({
    id: req.params.id,
    append_to_response: 'credits'
  })
  res.json(movie)
})

router.get('/search/:query&:page', async (req, res) => {
  const queryObject = JSON.parse(req.params.query)
  const movies = await moviedb.searchMovie({
    query: queryObject.search,
    page: req.params.page,
    primary_release_year: queryObject.year
  })
  res.json(movies)
})

router.get('/discover/:query&:page', async (req, res) => {
  const queryObject = JSON.parse(req.params.query)
  console.log('QUERYOBJECT: ', queryObject)
  const movies = await moviedb.discoverMovie({
    'vote_count.gte': 100,
    'with_runtime.gte': queryObject.with_runtime_gte || 1,
    'with_runtime.lte': queryObject.with_runtime_lte,
    with_genres: queryObject.with_genres.toString(),
    sort_by: queryObject.sort_by,
    'primary_release_date.gte': queryObject.release_date_gte,
    'primary_release_date.lte': queryObject.release_date_lte,
    page: req.params.page,
  })
  res.json(movies)
})

// REMOVE IF NO LONGER RELEVANT
router.get('/:id/credits', async (req, res) => {
  const movieCredits = await moviedb.movieCredits(req.params.id)
  res.json(movieCredits)
})

module.exports = router