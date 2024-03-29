const router = require('express').Router()
const Review = require('../models/review')
const Movie = require('../models/movie')
const { userExtractor } = require('../utils/middleware')
const { sequelize } = require('../utils/db')
const { User } = require('../models')

router.post('/', userExtractor, async (req, res) => {
  const { user_id, movie_id, title, poster_path, rating, review_text } = req.body

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
  const reviews = await Review.findAndCountAll({
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
    res.json(reviews)
  } else {
    res.status(401).send('Access denied')
  }
})

router.get('/movie/:movieId', async (req, res) => {
  const reviews = await Review.findAll({
    where: {
      movieId: req.params.movieId
    },
    limit: 3,
    order: [['updated_at', 'DESC']],
    include: {
      model: User
    }
  })
  res.json(reviews)
})

router.get('/movie/:movieId/rating', async (req, res) => {
  const reviews = await Review.findOne({
    attributes: [
      [sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']
    ],
    where: {
      movieId: req.params.movieId
    },
    group: 'movie_id'
  })
  res.json(reviews)
})

router.get('/:userId&:movieId', userExtractor, async (req, res) => {
  const review = await Review.findOne({
    where: {
      userId: req.params.userId,
      movieId: req.params.movieId
    }
  })
  if (review &&
    (req.user.id === review.userId
      || req.user.role === 'moderator'
      || req.user.role === 'admin'
    )) {
    res.json(review)
  } else if (!review) {
    res.status(204).end()
  } else {
    res.status(401).send('Access denied')
  }
})

router.delete('/:id', userExtractor, async (req, res) => {
  const review = await Review.findByPk(req.params.id)

  if (review &&
    (req.user.id === review.userId
      || req.user.role === 'moderator'
      || req.user.role === 'admin'
    )) {
    await review.destroy()
  }
  else {
    return res.status(401)
      .send({ error: 'You can only delete reviews created by yourself' })
  }

  res.status(204).end()
})

router.put('/:id', userExtractor, async (req, res) => {
  const { rating, review_text } = req.body
  const review = await Review.findByPk(req.params.id)

  if (review &&
    (req.user.id === review.userId
      || req.user.role === 'moderator'
      || req.user.role === 'admin'
    )) {
    review.rating = rating
    review.reviewText = review_text
    await review.save()
    res.json(review)
  }
  else {
    return res.status(401)
      .send({ error: 'You can only modify reviews created by yourself' })
  }
})

module.exports = router