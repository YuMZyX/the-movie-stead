const router = require('express').Router()
const config = require('../utils/config')
const { MovieDb } = require('moviedb-promise')

const moviedb = new MovieDb(config.TMDB_APIKEY)

router.get('/trending/:page', async (req, res) => {
  const trendingStars = await moviedb.trending({
    media_type: 'person',
    time_window: 'week',
    page: req.params.page
  })
  res.json(trendingStars)
})

router.get('/:id', async (req, res) => {
  try {
    const star = await moviedb.personInfo({
      id: req.params.id
    })
    res.json(star)
  } catch {
    return res.status(404).send({ error: 'Requested person not found' })
  }
})

router.get('/search/:query&:page', async (req, res) => {
  const queryObject = JSON.parse(req.params.query)
  const stars = await moviedb.searchPerson({
    query: queryObject.search,
    page: req.params.page
  })
  res.json(stars)
})

module.exports = router