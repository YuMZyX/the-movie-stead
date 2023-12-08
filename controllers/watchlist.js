const router = require('express').Router()
const Watchlist = require('../models/watchlist')
const { userExtractor } = require('../utils/middleware')

router.post('/', userExtractor, async (req, res) => {
  const watchlist = await Watchlist.create({
    userId: req.body.user_id,
    movieId: req.body.movie_id
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