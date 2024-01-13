const router = require('express').Router()
const Watchlist = require('../models/watchlist')
const Movie = require('../models/movie')
const { userExtractor } = require('../utils/middleware')

router.post('/', userExtractor, async (req, res) => {
  const { user_id, movie_id, title, poster_path } = req.body

  if (req.user.id !== user_id) {
    return res.status(401).send('Access denied')
  }

  const movie = await Movie.findByPk(movie_id)
  if (!movie) {
    await Movie.create({
      id: movie_id,
      title: title,
      poster_path: poster_path
    })
  }

  const wlExists = await Watchlist.findOne({
    where: {
      userId: user_id,
      movieId: movie_id
    }
  })
  if (wlExists) {
    return res.status(400).send('already exists on your watchlist')
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

router.get('/:userId&:movieId', userExtractor, async(req, res) => {
  const watchlist = await Watchlist.findOne({
    where: {
      userId: req.params.userId,
      movieId: req.params.movieId
    }
  })
  if (!watchlist) {
    return res.status(404).send({ error: 'Watchlist not found' })
  }
  res.json(watchlist)
})

router.get('/user/:userId', userExtractor, async (req, res) => {
  const watchlist = await Watchlist.findAndCountAll({
    where: {
      userId: req.params.userId
    },
    include: {
      model: Movie
    }
  })
  if (parseInt(req.user.id) === parseInt(req.params.userId)
    || req.user.role === 'moderator'
    || req.user.role === 'admin'
  ) {
    res.json(watchlist)
  } else {
    res.status(401).send('Access denied')
  }
})

module.exports = router