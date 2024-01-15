const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/test_helper')
const { User, Review, Movie } = require('../models')
const bcrypt = require('bcrypt')
const { sequelize } = require('../utils/db')
const api = supertest(app)
const baseUrl = '/api/reviews'

let token = ''
let notLoggedId = ''
let loggedId = ''
let reviewId = ''
let reviewOtherUserId = ''
let otherUserId = ''

describe('When not logged in, user', () => {

  beforeEach(async () => {
    await helper.emptyDbRows()

    const passwordHash = await bcrypt.hash('password', 10)
    await User.create({
      name: 'Initial User',
      email: 'init.user@gmail.com',
      password: passwordHash,
      role: 'user'
    })
    const user = await User.findOne({
      where: {
        email: 'init.user@gmail.com'
      }
    })
    notLoggedId = user.id

    await Movie.create({
      id: 872585,
      title: 'Oppenheimer',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
    })

    await Review.create({
      userId: notLoggedId,
      movieId: 872585,
      rating: 8,
      reviewText: 'Excellent movie'
    })
    const review = await Review.findOne({
      where: {
        userId: notLoggedId,
        movieId: 872585
      }
    })
    reviewId = review.id
  })

  test('can\'t access his/her reviews', async () => {
    const res = await api.get(`${baseUrl}/user/${notLoggedId}`)
      .expect(401)

    expect(res.body.error).toContain('Token missing')
  })

  test('can\'t access his/her review for a specific movie', async () => {
    const res = await api.get(`${baseUrl}/${notLoggedId}&872585`)
      .expect(401)

    expect(res.body.error).toContain('Token missing')
  })

  test('can access reviews of a specific movie', async () => {
    const res = await api.get(`${baseUrl}/movie/872585`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain('rating\":8')
    expect(res.text).toContain('reviewText\":\"Excellent movie')
    expect(res.text).toContain('name\":\"Initial User')
  })

  test('can access avg rating of a specific movie', async () => {
    const res = await api.get(`${baseUrl}/movie/872585/rating`)
      .expect(200)

    expect(res.text).toContain('avgRating\":\"8.0')
  })

  test('can\'t review a movie', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const review = {
      user_id: notLoggedId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
      rating: 4,
      review_text: 'Not my cup of tea'
    }
    const res = await api.post(baseUrl)
      .send(review)
      .expect(401)

    expect(res.body.error).toContain('Token missing')

    const reviewsAtEnd = await helper.reviewsInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length)
  })

  test('can\'t remove his/her review', async () => {
    const reviewsAtStart = await helper.reviewsInDb()

    const res = await api.delete(`${baseUrl}/${reviewId}`)
      .expect(401)

    expect(res.body.error).toContain('Token missing')

    const reviewsAtEnd = await helper.reviewsInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length)
  })

  test('can\'t modify his/her review', async () => {
    const review = { rating: 6, review_text: 'Not as good as I remembered' }
    const res = await api.put(`${baseUrl}/${reviewId}`)
      .send(review)
      .expect(401)

    expect(res.body.error).toContain('Token missing')
  })

})

describe('When logged in, user', () => {

  beforeEach(async () => {
    await helper.emptyDbRows()

    const passwordHash = await bcrypt.hash('password', 10)
    await User.create({
      name: 'Initial User',
      email: 'init.user@gmail.com',
      password: passwordHash,
      role: 'user'
    })
    await User.create({
      name: 'Test User',
      email: 'test.user@gmail.com',
      password: passwordHash,
      role: 'user'
    })

    const credentials = { email: 'init.user@gmail.com', password: 'password' }
    const res = await api.post('/api/login')
      .send(credentials)

    token = res.body.token
    loggedId = res.body.id

    const otherUser = await User.findOne({
      where: {
        email: 'test.user@gmail.com'
      }
    })
    otherUserId = otherUser.id

    await Movie.create({
      id: 872585,
      title: 'Oppenheimer',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
    })
    await Movie.create({
      id: 572802,
      title: 'Aquaman and the Lost Kingdom',
      poster_path: '/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg'
    })

    await Review.create({
      userId: loggedId,
      movieId: 872585,
      rating: 8,
      reviewText: 'Excellent movie'
    })
    const review = await Review.findOne({
      where: {
        userId: loggedId,
        movieId: 872585
      }
    })
    reviewId = review.id

    await Review.create({
      userId: otherUserId,
      movieId: 572802,
      rating: 3,
      reviewText: 'Not a fan of this movie'
    })
    const review2 = await Review.findOne({
      where: {
        userId: otherUserId,
        movieId: 572802
      }
    })
    reviewOtherUserId = review2.id
  })

  test('can access his/her reviews', async () => {
    const res = await api.get(`${baseUrl}/user/${loggedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.count).toBe(1)
    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":8')
    expect(res.text).toContain('reviewText\":\"Excellent movie')
    expect(res.text).toContain('title\":\"Oppenheimer')
  })

  test('can\'t access other users reviews', async () => {
    const res = await api.get(`${baseUrl}/user/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.text).toContain('Access denied')
  })

  test('can access his/her review for a specific movie', async () => {
    const res = await api.get(`${baseUrl}/${loggedId}&872585`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
  })

  test('can\'t access other users review for a specific movie', async () => {
    const res = await api.get(`${baseUrl}/${otherUserId}&572802`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.text).toContain('Access denied')
  })

  test('can review a movie', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: loggedId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
      rating: 4,
      review_text: 'Not my cup of tea'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":787699')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":4')
    expect(res.text).toContain('reviewText\":\"Not my cup of tea')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length + 1)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length + 1)
  })

  test('can\'t review a movie for other users', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: otherUserId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
      rating: 4,
      review_text: 'Not my cup of tea'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(401)

    expect(res.text).toContain('Access denied')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length)
  })

  test('can\'t review same movie twice', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: loggedId,
      movie_id: 872585,
      title: 'Oppenheimer',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      rating: 8,
      reviewText: 'Excellent movie'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(400)

    expect(res.text).toContain('You have already reviewed this movie')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length)
  })

  test('can\'t review a movie with rating missing', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: loggedId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
      review_text: 'Not my cup of tea'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(400)

    expect(res.body.error).toContain('notNull Violation: review.rating cannot be null')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length + 1)
  })

  test('can review a movie with review text missing', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: loggedId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
      rating: 8
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":787699')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":8')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length + 1)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length + 1)
  })

  test('movie is not added to DB if it already exists', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: loggedId,
      movie_id: 572802,
      title: 'Aquaman and the Lost Kingdom',
      poster_path: '/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg',
      rating: 9,
      review_text: 'I love Aquaman'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":572802')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":9')
    expect(res.text).toContain('reviewText\":\"I love Aquaman')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length + 1)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length)
  })

  test('can edit his/her own review', async () => {
    const review = { rating: 6, review_text: 'Not as good as I remembered' }
    const res = await api.put(`${baseUrl}/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":6')
    expect(res.text).toContain('reviewText\":\"Not as good as I remembered')
  })

  test('can\'t edit other users review', async () => {
    const review = { rating: 6, review_text: 'Not as good as I remembered' }
    const res = await api.put(`${baseUrl}/${reviewOtherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(401)

    expect(res.body.error).toContain('You can only modify reviews created by yourself')
  })

  test('can delete his/her own review', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    await api.delete(`${baseUrl}/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const reviewsAtEnd = await helper.reviewsInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length - 1)
  })

  test('can\'t delete other users review', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const res = await api.delete(`${baseUrl}/${reviewOtherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.body.error).toContain('You can only delete reviews created by yourself')

    const reviewsAtEnd = await helper.reviewsInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length)
  })

})

describe('When logged in, moderator', () => {

  beforeEach(async () => {
    await helper.emptyDbRows()

    const passwordHash = await bcrypt.hash('password', 10)
    await User.create({
      name: 'Initial User',
      email: 'init.user@gmail.com',
      password: passwordHash,
      role: 'moderator'
    })
    await User.create({
      name: 'Test User',
      email: 'test.user@gmail.com',
      password: passwordHash,
      role: 'user'
    })

    const credentials = { email: 'init.user@gmail.com', password: 'password' }
    const res = await api.post('/api/login')
      .send(credentials)

    token = res.body.token
    loggedId = res.body.id

    const otherUser = await User.findOne({
      where: {
        email: 'test.user@gmail.com'
      }
    })
    otherUserId = otherUser.id

    await Movie.create({
      id: 872585,
      title: 'Oppenheimer',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
    })
    await Movie.create({
      id: 572802,
      title: 'Aquaman and the Lost Kingdom',
      poster_path: '/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg'
    })

    await Review.create({
      userId: loggedId,
      movieId: 872585,
      rating: 8,
      reviewText: 'Excellent movie'
    })
    const review = await Review.findOne({
      where: {
        userId: loggedId,
        movieId: 872585
      }
    })
    reviewId = review.id

    await Review.create({
      userId: otherUserId,
      movieId: 572802,
      rating: 3,
      reviewText: 'Not a fan of this movie'
    })
    const review2 = await Review.findOne({
      where: {
        userId: otherUserId,
        movieId: 572802
      }
    })
    reviewOtherUserId = review2.id
  })

  test('can access his/her reviews', async () => {
    const res = await api.get(`${baseUrl}/user/${loggedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.count).toBe(1)
    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":8')
    expect(res.text).toContain('reviewText\":\"Excellent movie')
    expect(res.text).toContain('title\":\"Oppenheimer')
  })

  test('can access other users reviews', async () => {
    const res = await api.get(`${baseUrl}/user/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.body.count).toBe(1)
    expect(res.text).toContain('movieId\":572802')
    expect(res.text).toContain(`userId\":${otherUserId}`)
    expect(res.text).toContain('rating\":3')
    expect(res.text).toContain('reviewText\":\"Not a fan of this movie')
    expect(res.text).toContain('title\":\"Aquaman and the Lost Kingdom')
  })

  test('can access his/her review for a specific movie', async () => {
    const res = await api.get(`${baseUrl}/${loggedId}&872585`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
  })

  test('can access other users review for a specific movie', async () => {
    const res = await api.get(`${baseUrl}/${otherUserId}&572802`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain('movieId\":572802')
    expect(res.text).toContain(`userId\":${otherUserId}`)
  })

  test('can review a movie', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: loggedId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
      rating: 4,
      review_text: 'Not my cup of tea'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":787699')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":4')
    expect(res.text).toContain('reviewText\":\"Not my cup of tea')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length + 1)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length + 1)
  })

  test('can\'t review a movie for other users', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: otherUserId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
      rating: 4,
      review_text: 'Not my cup of tea'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(401)

    expect(res.text).toContain('Access denied')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length)
  })

  test('can edit his/her own review', async () => {
    const review = { rating: 6, review_text: 'Not as good as I remembered' }
    const res = await api.put(`${baseUrl}/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":6')
    expect(res.text).toContain('reviewText\":\"Not as good as I remembered')
  })

  test('can edit other users review', async () => {
    const review = { rating: 6, review_text: 'Not as good as I remembered' }
    const res = await api.put(`${baseUrl}/${reviewOtherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":572802')
    expect(res.text).toContain(`userId\":${otherUserId}`)
    expect(res.text).toContain('rating\":6')
    expect(res.text).toContain('reviewText\":\"Not as good as I remembered')
  })

  test('can delete his/her own review', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    await api.delete(`${baseUrl}/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const reviewsAtEnd = await helper.reviewsInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length - 1)
  })

  test('can delete other users review', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    await api.delete(`${baseUrl}/${reviewOtherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const reviewsAtEnd = await helper.reviewsInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length - 1)
  })

})

describe('When logged in, admin', () => {

  beforeEach(async () => {
    await helper.emptyDbRows()

    const passwordHash = await bcrypt.hash('password', 10)
    await User.create({
      name: 'Initial User',
      email: 'init.user@gmail.com',
      password: passwordHash,
      role: 'admin'
    })
    await User.create({
      name: 'Test User',
      email: 'test.user@gmail.com',
      password: passwordHash,
      role: 'moderator'
    })

    const credentials = { email: 'init.user@gmail.com', password: 'password' }
    const res = await api.post('/api/login')
      .send(credentials)

    token = res.body.token
    loggedId = res.body.id

    const otherUser = await User.findOne({
      where: {
        email: 'test.user@gmail.com'
      }
    })
    otherUserId = otherUser.id

    await Movie.create({
      id: 872585,
      title: 'Oppenheimer',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
    })
    await Movie.create({
      id: 572802,
      title: 'Aquaman and the Lost Kingdom',
      poster_path: '/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg'
    })

    await Review.create({
      userId: loggedId,
      movieId: 872585,
      rating: 8,
      reviewText: 'Excellent movie'
    })
    const review = await Review.findOne({
      where: {
        userId: loggedId,
        movieId: 872585
      }
    })
    reviewId = review.id

    await Review.create({
      userId: otherUserId,
      movieId: 572802,
      rating: 3,
      reviewText: 'Not a fan of this movie'
    })
    const review2 = await Review.findOne({
      where: {
        userId: otherUserId,
        movieId: 572802
      }
    })
    reviewOtherUserId = review2.id
  })

  test('can access his/her reviews', async () => {
    const res = await api.get(`${baseUrl}/user/${loggedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.count).toBe(1)
    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":8')
    expect(res.text).toContain('reviewText\":\"Excellent movie')
    expect(res.text).toContain('title\":\"Oppenheimer')
  })

  test('can access other users reviews', async () => {
    const res = await api.get(`${baseUrl}/user/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.body.count).toBe(1)
    expect(res.text).toContain('movieId\":572802')
    expect(res.text).toContain(`userId\":${otherUserId}`)
    expect(res.text).toContain('rating\":3')
    expect(res.text).toContain('reviewText\":\"Not a fan of this movie')
    expect(res.text).toContain('title\":\"Aquaman and the Lost Kingdom')
  })

  test('can access his/her review for a specific movie', async () => {
    const res = await api.get(`${baseUrl}/${loggedId}&872585`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
  })

  test('can access other users review for a specific movie', async () => {
    const res = await api.get(`${baseUrl}/${otherUserId}&572802`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain('movieId\":572802')
    expect(res.text).toContain(`userId\":${otherUserId}`)
  })

  test('can review a movie', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: loggedId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
      rating: 4,
      review_text: 'Not my cup of tea'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":787699')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":4')
    expect(res.text).toContain('reviewText\":\"Not my cup of tea')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length + 1)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length + 1)
  })

  test('can\'t review a movie for other users', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const review = {
      user_id: otherUserId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg',
      rating: 4,
      review_text: 'Not my cup of tea'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(401)

    expect(res.text).toContain('Access denied')

    const reviewsAtEnd = await helper.reviewsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length)
  })

  test('can edit his/her own review', async () => {
    const review = { rating: 6, review_text: 'Not as good as I remembered' }
    const res = await api.put(`${baseUrl}/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('rating\":6')
    expect(res.text).toContain('reviewText\":\"Not as good as I remembered')
  })

  test('can edit other users review', async () => {
    const review = { rating: 6, review_text: 'Not as good as I remembered' }
    const res = await api.put(`${baseUrl}/${reviewOtherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(review)
      .expect(200)

    expect(res.text).toContain('movieId\":572802')
    expect(res.text).toContain(`userId\":${otherUserId}`)
    expect(res.text).toContain('rating\":6')
    expect(res.text).toContain('reviewText\":\"Not as good as I remembered')
  })

  test('can delete his/her own review', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    await api.delete(`${baseUrl}/${reviewId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const reviewsAtEnd = await helper.reviewsInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length - 1)
  })

  test('can delete other users review', async () => {
    const reviewsAtStart = await helper.reviewsInDb()
    await api.delete(`${baseUrl}/${reviewOtherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const reviewsAtEnd = await helper.reviewsInDb()
    expect(reviewsAtEnd).toHaveLength(reviewsAtStart.length - 1)
  })

})


afterAll(async () => {
  await sequelize.close()
})