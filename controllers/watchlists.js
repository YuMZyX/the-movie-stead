const router = require('express').Router()
const Watchlist = require('../models/watchlist')
const Movie = require('../models/movie')
const { userExtractor } = require('../utils/middleware')

router.post('/', userExtractor, async (req, res) => {
  const { user_id, movie_id, title, poster_path } = req.body

  const movie = await Movie.findByPk(movie_id)
  if (!movie) {
    await Movie.create({
      id: movie_id,
      title: title,
      posterPath: poster_path
    })
  }

  const watchlist = await Watchlist.create({
    userId: user_id,
    movieId: movie_id
  })
  res.json(watchlist)
})

router.delete('/:id', userExtractor, async (req, res) => {
  const watchlist = await Watchlist.findByPk(req.params.id)
  if (req.user.id !== watchlist.userId) {
    return res.status(401)
      .send({ error: 'You can only delete movies from your own watchlist' })
  }
  if (watchlist) {
    await watchlist.destroy()
  }
  res.status(204).end()
})

module.exports = router