const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const baseUrl = '/api/movies'

describe('When fetching from movie API', () => {

  test('movies are returned as JSON', async () => {
    await api
      .get(`${baseUrl}/trending/1`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('20 movies are returned per page', async () => {
    const moviesP1 = await api.get(`${baseUrl}/trending/1`).expect(200)
    expect(moviesP1.body.results).toHaveLength(20)

    const moviesP5 = await api.get(`${baseUrl}/trending/5`).expect(200)
    expect(moviesP5.body.results).toHaveLength(20)
  })

  test('movies queries fail if no page number is provided', async () => {
    await api.get(`${baseUrl}/trending`).expect(404)

    const search = { search: 'Harry Potter', year: 2001 }
    const query = JSON.stringify(search)
    await api.get(`${baseUrl}/search/${query}`).expect(404)
  })

  test('genres are returned with id and name', async () => {
    const genres = await api.get(`${baseUrl}/genres`).expect(200)
    const ids = genres.body.genres.map(g => g.id)
    const names = genres.body.genres.map(g => g.name)

    expect(ids).toBeDefined()
    expect(names).toBeDefined()
  })

  test('movies are sorted by vote_average when querying top rated movies', async () => {
    const movies = await api.get(`${baseUrl}/toprated`).expect(200)
    expect(movies.body.results).toHaveLength(20)

    const voteAverages = movies.body.results.map(m => m.vote_average)
    const maxAverage = Math.max(...voteAverages)
    const minAverage = Math.min(...voteAverages)

    expect(maxAverage).toBeCloseTo(movies.body.results[0].vote_average, 1)
    expect(minAverage).toBeCloseTo(movies.body.results[19].vote_average, 1)
  })

})

describe('Fetching details of a specific movie', () => {

  test('succeeds with a valid movie id', async () => {
    const movie = await api.get(`${baseUrl}/753342`).expect(200)
    const genres = movie.body.genres.map(g => g.name)

    expect(movie.body.title).toBe('Napoleon')
    expect(movie.body.credits).toBeDefined()
    expect(genres).toContain('History')
    expect(movie.body.release_date).toContain('2023-11-22')
    expect(movie.body.runtime).toBe(158)
  })

  test('fails with an invalid movie id', async () => {
    const movie = await api.get(`${baseUrl}/123456789`).expect(404)
    expect(movie.body.error).toContain('Requested movie not found')
  })

})

describe('Searching for a movie', () => {

  test('succeeds with a valid query', async () => {
    const search = { search: 'Harry Potter', year: 2001 }
    const query = JSON.stringify(search)
    const movies = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)
    const titles = movies.body.results.map(m => m.title)
    const years = movies.body.results.map(m => m.release_date)

    expect(movies.body.page).toBe(1)
    expect(titles).toContain('Harry Potter and the Philosopher\'s Stone')
    expect(years[0]).toContain('2001')
    expect(years.toString()).not.toContain('2002')
    expect(years.toString()).not.toContain('2000')
  })

  test('queries all years if year param is not specified', async () => {
    const search = { search: 'Die Hard' }
    const query = JSON.stringify(search)
    const movies = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)
    const titles = movies.body.results.map(m => m.title)
    const years = movies.body.results.map(m => m.release_date)

    expect(movies.body.page).toBe(1)
    expect(titles).toContain('Die Hard')
    expect(titles).toContain('Die Hard 2')
    expect(years.toString()).toContain('1988')
    expect(years.toString()).toContain('1990')
    expect(years.toString()).toContain('1995')
  })

  test('returns empty table if search string is not provided', async () => {
    const search = { year: 2000 }
    const query = JSON.stringify(search)
    const movies = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)

    expect(movies.body.results).toEqual([])
  })

  test('queries as a string if search string is a number', async () => {
    const search = { search: 1917 }
    const query = JSON.stringify(search)
    const movies = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)
    const titles = movies.body.results.map(m => m.title)

    expect(titles).toContain('1917')
  })

  test('ignores year if it is not in valid format', async () => {
    const search = { search: 'Die Hard', year: 'test' }
    const query = JSON.stringify(search)
    const movies = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)
    const titles = movies.body.results.map(m => m.title)
    const years = movies.body.results.map(m => m.release_date)

    expect(movies.body.page).toBe(1)
    expect(titles).toContain('Die Hard')
    expect(titles).toContain('Die Hard 2')
    expect(years.toString()).toContain('1988')
    expect(years.toString()).toContain('1990')
    expect(years.toString()).toContain('1995')
  })

  test('returns empty table if there are no results', async () => {
    const search = { search: 'ThisMovieDoesNotExist' }
    const query = JSON.stringify(search)
    const movies = await api.get(`${baseUrl}/search/${query}&1`)
      .expect(200)

    expect(movies.body.results).toEqual([])
  })

})

describe('Discovering movies (advanced search)', () => {

  test('returns all (vote_count > 50 & runtime > 1) movies if query filters are empty',
    async () => {
      const search = {
        with_runtime_gte: '',
        with_runtime_lte: '',
        with_genres: '',
        sort_by: '',
        release_date_gte: '',
        release_date_lte: ''
      }
      const query = JSON.stringify(search)
      const discover = await api.get(`${baseUrl}/discover/${query}&1`)
        .expect(200)

      expect(discover.body.total_pages).toBeGreaterThan(900)
    })

  test('returns all movies if query filters are not specified', async () => {
    const search = {}
    const query = JSON.stringify(search)
    const discover = await api.get(`${baseUrl}/discover/${query}&1`)
      .expect(200)

    expect(discover.body.total_pages).toBeGreaterThan(900)
  })

  test('returns only movies within specified release date limits', async () => {
    const search = {
      release_date_gte: '2023-12-01',
      release_date_lte: '2023-12-31'
    }
    const query = JSON.stringify(search)
    const discover = await api.get(`${baseUrl}/discover/${query}&1`)
      .expect(200)

    const releaseDates = discover.body.results.map(m => m.release_date)
    expect(releaseDates.toString()).toContain('2023-12')
    expect(releaseDates.toString()).not.toContain('2023-11')
    expect(releaseDates.toString()).not.toContain('2024-01')
  })

  test('returns only movies of specified genre', async () => {
    const search = {
      with_genres: '12',
    }
    const query = JSON.stringify(search)
    const discover = await api.get(`${baseUrl}/discover/${query}&1`)
      .expect(200)

    const genreMovies = discover.body.results.map((m) => {
      m.genre_ids.filter((genre) => genre === 12)
    })
    expect(genreMovies).toHaveLength(20)
  })

  test('movies are correctly sorted by release date, descending', async () => {
    const search = {
      sort_by: 'primary_release_date.desc',
    }
    const query = JSON.stringify(search)
    const discover = await api.get(`${baseUrl}/discover/${query}&1`)
      .expect(200)

    const releaseDates = discover.body.results.map(m => m.release_date)
    const formattedDates = releaseDates.map((date) => new Date(date).getTime())
    const maxDate = Math.max(...formattedDates)
    const minDate = Math.min(...formattedDates)

    expect(maxDate).toBe(new Date(discover.body.results[0].release_date).getTime())
    expect(minDate).toBe(new Date(discover.body.results[19].release_date).getTime())
  })

  test('movies are correctly sorted by release date, ascending', async () => {
    const search = {
      sort_by: 'primary_release_date.asc',
    }
    const query = JSON.stringify(search)
    const discover = await api.get(`${baseUrl}/discover/${query}&2`)
      .expect(200)

    const releaseDates = discover.body.results.map(m => m.release_date)
    const formattedDates = releaseDates.map((date) => new Date(date).getTime())
    const maxDate = Math.max(...formattedDates)
    const minDate = Math.min(...formattedDates)

    expect(maxDate).toBe(new Date(discover.body.results[19].release_date).getTime())
    expect(minDate).toBe(new Date(discover.body.results[0].release_date).getTime())
  })

  test('movies are correctly sorted by title (A-Z)', async () => {
    const search = {
      sort_by: 'original_title.asc',
    }
    const query = JSON.stringify(search)
    const discover = await api.get(`${baseUrl}/discover/${query}&1`)
      .expect(200)

    const firstTitle = discover.body.results[0].original_title
    const lastTitle = discover.body.results[19].original_title

    const sortedMovies = discover.body.results.sort((a, b) => {
      a.original_title.localeCompare(b.original_title)
    })
    expect(sortedMovies[0].original_title).toBe(firstTitle)
    expect(sortedMovies[19].original_title).toBe(lastTitle)
  })

  test('movies are correctly sorted by title (Z-A)', async () => {
    const search = {
      sort_by: 'original_title.desc',
    }
    const query = JSON.stringify(search)
    const discover = await api.get(`${baseUrl}/discover/${query}&2`)
      .expect(200)

    const firstTitle = discover.body.results[0].original_title
    const lastTitle = discover.body.results[19].original_title

    const sortedMovies = discover.body.results.sort((a, b) => {
      b.original_title.localeCompare(a.original_title)
    })
    expect(sortedMovies[0].original_title).toBe(firstTitle)
    expect(sortedMovies[19].original_title).toBe(lastTitle)
  })

})