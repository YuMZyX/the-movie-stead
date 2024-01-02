import axios from 'axios'
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/watchlists`

const getToken = () => {
  return `Bearer ${JSON.parse(window.localStorage.getItem('loggedTMSUser')).token}`
}

const addToWatchlist = async (movie) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.post(baseUrl, movie, config)
  return res.data
}

const getWatchlistId = async (userId, movieId) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.get(`${baseUrl}/${userId}&${movieId}`, config)
  return res.data
}

const getWatchlistMovies = async (id) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.get(`${baseUrl}/user/${id}`, config)
  return res.data
}

const removeFromWatchlist = async (id) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}

export default {
  addToWatchlist,
  getWatchlistId,
  getWatchlistMovies,
  removeFromWatchlist,
}