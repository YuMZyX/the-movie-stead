const supertest = require('supertest')
const app = require('../app')
const helper = require('../utils/test_helper')
const { User } = require('../models')
const bcrypt = require('bcrypt')
const { sequelize } = require('../utils/db')
const api = supertest(app)
const baseUrl = '/api'

let userId = ''

describe('When user account is already created', () => {

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
      role: 'user',
      disabled: true
    })
  })

  test('logging in succeeds with correct credentials', async () => {
    const sessionsAtStart = await helper.sessionsInDb()
    const credentials = {
      email: 'init.user@gmail.com',
      password: 'password'
    }

    const res = await api.post(`${baseUrl}/login`)
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.text).toContain(credentials.email)

    const sessionsAtEnd = await helper.sessionsInDb()
    expect(sessionsAtEnd).toHaveLength(sessionsAtStart.length + 1)
  })

  test('logging in fails with wrong credentials', async () => {
    const sessionsAtStart = await helper.sessionsInDb()
    const credentials1 = {
      email: 'init.user2@gmail.com',
      password: 'password'
    }
    const credentials2 = {
      email: 'init.user@gmail.com',
      password: 'passwor'
    }

    const res = await api.post(`${baseUrl}/login`)
      .send(credentials1)
      .expect(401)

    expect(res.text).toContain('Invalid username or password')

    const res2 = await api.post(`${baseUrl}/login`)
      .send(credentials2)
      .expect(401)

    expect(res2.text).toContain('Invalid username or password')

    const sessionsAtEnd = await helper.sessionsInDb()
    expect(sessionsAtEnd).toHaveLength(sessionsAtStart.length)
  })

  test('logging in fails if account is disabled', async () => {
    const sessionsAtStart = await helper.sessionsInDb()
    const credentials = {
      email: 'test.user@gmail.com',
      password: 'password'
    }

    const res = await api.post(`${baseUrl}/login`)
      .send(credentials)
      .expect(401)

    expect(res.text).toContain('Account disabled, contact admin/moderator')

    const sessionsAtEnd = await helper.sessionsInDb()
    expect(sessionsAtEnd).toHaveLength(sessionsAtStart.length)
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

    const user = await User.findOne({
      where: {
        email: 'init.user@gmail.com'
      }
    })
    userId = user.id

    const credentials = { email: 'init.user@gmail.com', password: 'password' }
    await api.post(`${baseUrl}/login`).send(credentials)
  })

  test('user can log out', async () => {
    const sessionsAtStart = await helper.sessionsInDb()

    const res = await api.delete(`${baseUrl}/logout/${userId}`)
      .expect(200)

    expect(res.text).toContain(`user ${userId} logged out`)

    const sessionsAtEnd = await helper.sessionsInDb()
    expect(sessionsAtEnd).toHaveLength(sessionsAtStart.length - 1)
  })

})

afterAll(async () => {
  await sequelize.close()
})