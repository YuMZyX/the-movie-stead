const router = require('express').Router()
const Review = require('../models/review')
const Movie = require('../models/movie')
const { userExtractor } = require('../utils/middleware')

router.post('/', userExtractor, async (req, res) => {
  const { user_id, movie_id, title, poster_path, rating, review_text } = req.body

  const movie = await Movie.findByPk(movie_id)
  if (!movie) {
    await Movie.create({
      id: movie_id,
      title: title,
      poster_path: poster_path
    })
  }

  const reviewExists = await Review.findOne({
    where: {
      userId: user_id,
      movieId: movie_id
    }
  })
  if (reviewExists) {
    return res.status(400).send('You have already reviewed this movie')
  }

  const review = await Review.create({
    userId: user_id,
    movieId: movie_id,
    rating: rating,
    reviewText: review_text
  })
  res.json(review)
})

router.get('/user/:userId', userExtractor, async (req, res) => {
  const reviews = await Review.findAll({
    where: {
      userId: req.params.userId
    },
    include: {
      model: Movie
    }
  })
  res.json(reviews)
})

module.exports = router