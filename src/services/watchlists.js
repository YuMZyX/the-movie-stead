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

const getWatchlist = async (id) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.get(`${baseUrl}/${id}`, config)
  return res.data
}

const removeFromWatchlist = async (id) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}

export default { addToWatchlist, getWatchlist, removeFromWatchlist }