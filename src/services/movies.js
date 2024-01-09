import axios from 'axios'
const baseUrl = '/api/movies'

const getTrending = async (page) => {
  const res = await axios.get(`${baseUrl}/trending/${page}`)
  return res.data
}

const getMovie = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`)
  return res.data
}

const getGenres = async () => {
  const res = await axios.get(`${baseUrl}/genres`)
  return res.data
}

const getTopRated = async () => {
  const res = await axios.get(`${baseUrl}/toprated`)
  return res.data
}

const searchMovies = async (query, page) => {
  const queryObject = JSON.stringify(query)
  const res = await axios.get(`${baseUrl}/search/${queryObject}&${page}`)
  return res.data
}

const discoverMovies = async (query, page) => {
  const queryObject = JSON.stringify(query)
  const res = await axios.get(`${baseUrl}/discover/${queryObject}&${page}`)
  return res.data
}

// REMOVE IF NO LONGER RELEVANT
const getMovieCredits = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}/credits`)
  return res.data
}

export default {
  getTrending,
  getMovie,
  getGenres,
  getTopRated,
  searchMovies,
  discoverMovies,
  getMovieCredits
}