const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const baseUrl = '/api/stars'

describe('When fetching from movie API', () => {

  test('stars are returned as JSON', async () => {
    await api
      .get(`${baseUrl}/trending/1`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('20 stars are returned per page', async () => {
    const starsP1 = await api.get(`${baseUrl}/trending/1`).expect(200)
    expect(starsP1.body.results).toHaveLength(20)

    const starsP5 = await api.get(`${baseUrl}/trending/5`).expect(200)
    expect(starsP5.body.results).toHaveLength(20)
  })

  test('stars queries fail if no page number is provided', async () => {
    await api.get(`${baseUrl}/trending`).expect(404)

    const search = { search: 'Leonardo' }
    const query = JSON.stringify(search)
    await api.get(`${baseUrl}/search/${query}`).expect(404)
  })

})

describe('Fetching details of a specific star', () => {

  test('succeeds with a valid person id', async () => {
    const star = await api.get(`${baseUrl}/976`).expect(200)

    expect(star.body.name).toBe('Jason Statham')
    expect(star.body.movie_credits).toBeDefined()
    expect(star.body.place_of_birth).toContain('Shirebrook, Derbyshire, England')
    expect(star.body.gender).toBe(2)
  })

  test('fails with an invalid person id', async () => {
    const star = await api.get(`${baseUrl}/123456789`).expect(404)
    expect(star.body.error).toContain('Requested person not found')
  })

})

describe('Searching for a star', () => {

  test('succeeds with a valid query', async () => {
    const search = { search: 'Leonardo' }
    const query = JSON.stringify(search)
    const stars = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)
    const names = stars.body.results.map(s => s.name)

    expect(stars.body.page).toBe(1)
    expect(names).toContain('Leonardo DiCaprio')
  })

  test('returns empty table if search string is not provided', async () => {
    const search = {}
    const query = JSON.stringify(search)
    const stars = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)

    expect(stars.body.results).toEqual([])
  })

  test('queries as a string if search string is a number', async () => {
    const search = { search: 2000 }
    const query = JSON.stringify(search)
    const stars = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)
    const names = stars.body.results.map(s => s.name)

    expect(names).toContain('Futura 2000')
  })

  test('returns empty table if there are no results', async () => {
    const search = { search: 'ThisPersonDoesNotExist' }
    const query = JSON.stringify(search)
    const stars = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)

    expect(stars.body.results).toEqual([])
  })

})