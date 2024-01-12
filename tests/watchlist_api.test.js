const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const { User, Session, Watchlist, Movie } = require('../models')
const bcrypt = require('bcrypt')
const { sequelize } = require('../utils/db')
const api = supertest(app)
const baseUrl = '/api/watchlists'

let token = ''
let notLoggedId = ''
let loggedId = ''
let watchlistId = ''

describe.skip('When not logged in', () => {

  beforeEach(async () => {
    await Session.destroy({ where: {} })
    await Watchlist.destroy({ where: {} })
    await Movie.destroy({ where: {} })
    await User.destroy({ where: {} })

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
    await Session.destroy({ where: {} })
    await Watchlist.destroy({ where: {} })
    await Movie.destroy({ where: {} })
    await User.destroy({ where: {} })

    const passwordHash = await bcrypt.hash('password', 10)
    await User.create({
      name: 'Initial User',
      email: 'init.user@gmail.com',
      password: passwordHash,
      role: 'user'
    })
    const credentials = { email: 'init.user@gmail.com', password: 'password' }
    const res = await api.post('/api/login')
      .send(credentials)

    token = res.body.token
    loggedId = res.body.id

    await Movie.create({
      id: 872585,
      title: 'Oppenheimer',
      poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
    })

    await Watchlist.create({
      userId: loggedId,
      movieId: 872585
    })
    const watchlist = await Watchlist.findOne({
      where: {
        userId: loggedId,
        movieId: 872585
      }
    })
    watchlistId = watchlist.id
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

})

afterAll(async () => {
  await sequelize.close()
})