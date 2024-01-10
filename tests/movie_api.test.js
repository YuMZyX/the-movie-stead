const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('Movies are returned as JSON', async () => {
  await api
    .get('/api/movies/trending/1')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('20 movies are returned per page', async () => {
  const moviesP1 = await api.get('/api/movies/trending/1')
  expect(moviesP1.body.results).toHaveLength(20)

  const moviesP5 = await api.get('/api/movies/trending/5')
  expect(moviesP5.body.results).toHaveLength(20)
})