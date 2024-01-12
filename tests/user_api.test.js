const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const { User, Session } = require('../models')
const bcrypt = require('bcrypt')
const { sequelize } = require('../utils/db')
const api = supertest(app)
const baseUrl = '/api/users'

let token = ''
let loggedId = ''
let otherUserId = ''

describe.skip('Sign Up', () => {

  beforeEach(async () => {
    await User.destroy({ where: {} })

    const passwordHash = await bcrypt.hash('password', 10)
    await User.create({
      name: 'Initial User',
      email: 'init.user@gmail.com',
      password: passwordHash,
      role: 'user'
    })
  })

  test('succeeds with valid input', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = {
      name: 'Test User',
      email: 'test@testing.com',
      password: 'secretPW',
      role: 'user'
    }

    await api.post(baseUrl)
      .send(user)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const emails = usersAtEnd.map(u => u.email)
    expect(emails).toContain(user.email)
  })

  test('fails if email already exists in DB', async () => {
    const usersAtStart = await helper.usersInDb()
    const user = {
      name: 'Test User',
      email: 'init.user@gmail.com',
      password: 'secretPW',
      role: 'user'
    }

    const res = await api.post(baseUrl)
      .send(user)
      .expect(400)

    expect(res.text).toContain('Email address already exists, try logging in.')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails if name, email or password is missing', async () => {
    const usersAtStart = await helper.usersInDb()
    const user1 = {
      email: 'user1@gmail.com',
      password: 'secretPW',
      role: 'user'
    }
    const user2 = {
      name: 'Test User2',
      password: 'secretPW',
      role: 'user'
    }
    const user3 = {
      name: 'Test User3',
      email: 'user3@gmail.com',
      role: 'user'
    }

    const res1 = await api.post(baseUrl)
      .send(user1)
      .expect(400)
    expect(res1.text).toContain('Name, email or password is missing')

    const res2 = await api.post(baseUrl)
      .send(user2)
      .expect(400)
    expect(res2.text).toContain('Name, email or password is missing')

    const res3 = await api.post(baseUrl)
      .send(user3)
      .expect(400)
    expect(res3.text).toContain('Name, email or password is missing')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})

describe.skip('When logged in, user', () => {

  beforeEach(async () => {
    await Session.destroy({ where: {} })
    await User.destroy({ where: {} })

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
  })

  test('can see his/her own info', async () => {
    const res = await api.get(`${baseUrl}/${loggedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.text).toContain(loggedId.toString())
    expect(res.text).toContain('init.user@gmail.com')
    expect(res.text).toContain('Initial User')
  })

  test('can\'t see other users info', async () => {
    const res = await api.get(`${baseUrl}/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.text).toContain('Access denied')
  })

  test('can\'t access list of users', async () => {
    const res = await api.get(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.body.error).toContain('Not allowed to access this content')
  })

  test('can\'t access list of all users', async () => {
    const res = await api.get(`${baseUrl}/admin`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.body.error).toContain('Not allowed to access this content')
  })

  test('can\'t modify users disabled status', async () => {
    const disabled = { disabled: true }
    const res = await api.put(`${baseUrl}/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(disabled)
      .expect(401)

    expect(res.body.error).toContain('Not allowed to access this content')
  })

  test('can\'t modify users role', async () => {
    const disabled = { role: 'moderator' }
    const res = await api.put(`${baseUrl}/${otherUserId}/admin`)
      .set('Authorization', `Bearer ${token}`)
      .send(disabled)
      .expect(401)

    expect(res.body.error).toContain('Not allowed to access this content')
  })

  test('can\'t delete users', async () => {
    const res = await api.delete(`${baseUrl}/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.body.error).toContain('Not allowed to access this content')
  })

})

describe.skip('When logged in, moderator', () => {

  beforeEach(async () => {
    await Session.destroy({ where: {} })
    await User.destroy({ where: {} })

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
  })

  test('can see his/her own info', async () => {
    const res = await api.get(`${baseUrl}/${loggedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.text).toContain(loggedId.toString())
    expect(res.text).toContain('init.user@gmail.com')
    expect(res.text).toContain('Initial User')
  })

  test('can see other users info', async () => {
    const res = await api.get(`${baseUrl}/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain(otherUserId.toString())
    expect(res.text).toContain('test.user@gmail.com')
    expect(res.text).toContain('Test User')
  })

  test('can access list of users', async () => {
    const res = await api.get(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain(otherUserId.toString())
    expect(res.text).toContain('test.user@gmail.com')
    expect(res.text).toContain('Test User')
  })

  test('can\'t access list of all users', async () => {
    const res = await api.get(`${baseUrl}/admin`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.body.error).toContain('Not allowed to access this content')
  })

  test('can modify users disabled status', async () => {
    const disabled = { disabled: true }
    const res = await api.put(`${baseUrl}/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(disabled)
      .expect(200)

    expect(res.text).toContain(otherUserId.toString())
    expect(res.text).toContain('test.user@gmail.com')
    expect(res.text).toContain('Test User')
    expect(res.text).toContain('"disabled\":true')
  })

  test('can\'t modify users role', async () => {
    const role = { role: 'moderator' }
    const res = await api.put(`${baseUrl}/${otherUserId}/admin`)
      .set('Authorization', `Bearer ${token}`)
      .send(role)
      .expect(401)

    expect(res.body.error).toContain('Not allowed to access this content')
  })

  test('can\'t delete users', async () => {
    const res = await api.delete(`${baseUrl}/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401)

    expect(res.body.error).toContain('Not allowed to access this content')
  })

})

describe.skip('When logged in, admin', () => {

  beforeEach(async () => {
    await Session.destroy({ where: {} })
    await User.destroy({ where: {} })

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
      role: 'user'
    })
    await User.create({
      name: 'Moderator User',
      email: 'moderator.user@gmail.com',
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
  })

  test('can see his/her own info', async () => {
    const res = await api.get(`${baseUrl}/${loggedId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.text).toContain(loggedId.toString())
    expect(res.text).toContain('init.user@gmail.com')
    expect(res.text).toContain('Initial User')
  })

  test('can see other users info', async () => {
    const res = await api.get(`${baseUrl}/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain(otherUserId.toString())
    expect(res.text).toContain('test.user@gmail.com')
    expect(res.text).toContain('Test User')
  })

  test('can access list of users', async () => {
    const res = await api.get(baseUrl)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain(otherUserId.toString())
    expect(res.text).toContain('test.user@gmail.com')
    expect(res.text).toContain('Test User')
  })

  test('can access list of all users', async () => {
    const res = await api.get(`${baseUrl}/admin`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.text).toContain('test.user@gmail.com')
    expect(res.text).toContain('Test User')
    expect(res.text).toContain('moderator.user@gmail.com')
    expect(res.text).toContain('Moderator User')
  })

  test('can modify users disabled status', async () => {
    const disabled = { disabled: true }
    const res = await api.put(`${baseUrl}/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(disabled)
      .expect(200)

    expect(res.text).toContain(otherUserId.toString())
    expect(res.text).toContain('test.user@gmail.com')
    expect(res.text).toContain('Test User')
    expect(res.text).toContain('"disabled\":true')
  })

  test('can modify users role', async () => {
    const role = { role: 'moderator' }
    const res = await api.put(`${baseUrl}/${otherUserId}/admin`)
      .set('Authorization', `Bearer ${token}`)
      .send(role)
      .expect(200)

    expect(res.text).toContain(otherUserId.toString())
    expect(res.text).toContain('test.user@gmail.com')
    expect(res.text).toContain('Test User')
    expect(res.text).toContain('"role\":\"moderator')
  })

  test('can delete users', async () => {
    const usersAtStart = await helper.usersInDb()
    await api.delete(`${baseUrl}/${otherUserId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length - 1)
  })

})

afterAll(async () => {
  await sequelize.close()
})