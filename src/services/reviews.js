import axios from 'axios'
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/reviews`

const getToken = () => {
  return `Bearer ${JSON.parse(window.localStorage.getItem('loggedTMSUser')).token}`
}

const createReview = async (movieReview) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.post(baseUrl, movieReview, config)
  return res.data
}

const getUserReviews = async (id) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.get(`${baseUrl}/user/${id}`, config)
  return res.data
}

export default {
  createReview,
  getUserReviews
}