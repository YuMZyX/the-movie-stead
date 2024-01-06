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

const searchMovies = async (query, page) => {
  const res = await axios.get(`${baseUrl}/search/${query}&${page}`)
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
  searchMovies,
  getMovieCredits
}