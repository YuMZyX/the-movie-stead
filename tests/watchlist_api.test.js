const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const { User, Watchlist, Movie } = require('../models')
const bcrypt = require('bcrypt')
const { sequelize } = require('../utils/db')
const api = supertest(app)
const baseUrl = '/api/watchlists'

let token = ''
let notLoggedId = ''
let loggedId = ''
let watchlistId = ''
let watchlistOtherUserId = ''
let otherUserId = ''

describe('When not logged in', () => {

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

    await Watchlist.create({
      userId: notLoggedId,
      movieId: 872585
    })
    const watchlist = await Watchlist.findOne({
      where: {
        userId: notLoggedId,
        movieId: 872585
      }
    })
    watchlistId = watchlist.id
  })

  test('user can\'t access his/her watchlist', async () => {
    const res = await api.get(`${baseUrl}/user/${notLoggedId}`)
      .expect(401)

    expect(res.body.error).toContain('Token missing')
  })

  test('user can\'t add movies to his/her watchlist', async () => {
    const watchlistsAtStart = await helper.watchlistsInDb()
    const watchlist = {
      user_id: notLoggedId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg'
    }
    const res = await api.post(baseUrl)
      .send(watchlist)
      .expect(401)

    expect(res.body.error).toContain('Token missing')

    const watchlistsAtEnd = await helper.watchlistsInDb()
    expect(watchlistsAtEnd).toHaveLength(watchlistsAtStart.length)
  })

  test('user can\'t remove movies from his/her watchlist', async () => {
    const watchlistsAtStart = await helper.watchlistsInDb()

    const res = await api.delete(`${baseUrl}/${watchlistId}`)
      .expect(401)

    expect(res.body.error).toContain('Token missing')

    const watchlistsAtEnd = await helper.watchlistsInDb()
    expect(watchlistsAtEnd).toHaveLength(watchlistsAtStart.length)
  })

})

describe('When logged in', () => {

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

    await Watchlist.create({
      userId: loggedId,
      movieId: 872585
    })
    const watchlist1 = await Watchlist.findOne({
      where: {
        userId: loggedId,
        movieId: 872585
      }
    })
    watchlistId = watchlist1.id

    await Watchlist.create({
      userId: otherUserId,
      movieId: 572802
    })
    const watchlist2 = await Watchlist.findOne({
      where: {
        userId: otherUserId,
        movieId: 572802
      }
    })
    watchlistOtherUserId = watchlist2.id
  })

  test('user can access his/her watchlist', async () => {
    const res = await api.get(`${baseUrl}/user/${loggedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body.count).toBe(1)
    expect(res.text).toContain('872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain('Oppenheimer')
  })

  test('user can\'t access other users watchlist', async () => {
    const res = await api.get(`${baseUrl}/user/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.text).toContain('Access denied')
  })

  test('user can add movies to his/her watchlist', async () => {
    const watchlistsAtStart = await helper.watchlistsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const watchlist = {
      user_id: loggedId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(watchlist)
      .expect(200)

    expect(res.text).toContain('787699')
    expect(res.text).toContain(`userId\":${loggedId}`)

    const watchlistsAtEnd = await helper.watchlistsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(watchlistsAtEnd).toHaveLength(watchlistsAtStart.length + 1)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length + 1)
  })

  test('user can\'t add movies to other users watchlist', async () => {
    const watchlistsAtStart = await helper.watchlistsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const watchlist = {
      user_id: otherUserId,
      movie_id: 787699,
      title: 'Wonka',
      poster_path: '/qhb1qOilapbapxWQn9jtRCMwXJF.jpg'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(watchlist)
      .expect(401)

    expect(res.text).toContain('Access denied')

    const watchlistsAtEnd = await helper.watchlistsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(watchlistsAtEnd).toHaveLength(watchlistsAtStart.length)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length)
  })

  test('user can delete movies from his/her watchlist', async () => {
    const watchlistsAtStart = await helper.watchlistsInDb()

    await api.delete(`${baseUrl}/${watchlistId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const watchlistsAtEnd = await helper.watchlistsInDb()
    expect(watchlistsAtEnd).toHaveLength(watchlistsAtStart.length - 1)
  })

  test('user can\'t delete movies from other users watchlist', async () => {
    const watchlistsAtStart = await helper.watchlistsInDb()

    const res = await api.delete(`${baseUrl}/${watchlistOtherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.body.error).toContain('You can only delete movies from your own watchlist')

    const watchlistsAtEnd = await helper.watchlistsInDb()
    expect(watchlistsAtEnd).toHaveLength(watchlistsAtStart.length)
  })

  test('user can\'t add same movie twice to watchlist', async () => {
    const watchlistsAtStart = await helper.watchlistsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const watchlist = {
      user_id: loggedId,
      movie_id: 872585,
      title: 'Oppenheimer',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(watchlist)
      .expect(400)

    expect(res.text).toContain('already exists on your watchlist')

    const watchlistsAtEnd = await helper.watchlistsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(watchlistsAtEnd).toHaveLength(watchlistsAtStart.length)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length)
  })

  test('movie is not added to DB if it already exists', async () => {
    const watchlistsAtStart = await helper.watchlistsInDb()
    const moviesAtStart = await helper.moviesInDb()
    const watchlist = {
      user_id: loggedId,
      movie_id: 572802,
      title: 'Aquaman and the Lost Kingdom',
      poster_path: '/8xV47NDrjdZDpkVcCFqkdHa3T0C.jpg'
    }
    const res = await api.post(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .send(watchlist)
      .expect(200)

    expect(res.text).toContain('572802')
    expect(res.text).toContain(`userId\":${loggedId}`)

    const watchlistsAtEnd = await helper.watchlistsInDb()
    const moviesAtEnd = await helper.moviesInDb()
    expect(watchlistsAtEnd).toHaveLength(watchlistsAtStart.length + 1)
    expect(moviesAtEnd).toHaveLength(moviesAtStart.length)
  })

  test('user can request single watchlist', async () => {
    const res = await api.get(`${baseUrl}/${loggedId}&872585`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain('872585')
    expect(res.text).toContain(`userId\":${loggedId}`)
    expect(res.text).toContain(`id\":${watchlistId}`)
  })

  test('requesting single watchlist fails if watchlist doesn\'t exist', async () => {
    const res = await api.get(`${baseUrl}/${loggedId}&123456`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)

    expect(res.body.error).toContain('Watchlist not found')
  })

})

afterAll(async () => {
  await sequelize.close()
})