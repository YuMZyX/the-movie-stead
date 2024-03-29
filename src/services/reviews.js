import axios from 'axios'
const baseUrl = '/api/reviews'

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

const getMovieReviews = async (id) => {
  const res = await axios.get(`${baseUrl}/movie/${id}`)
  return res.data
}

const getMovieRating = async (id) => {
  const res = await axios.get(`${baseUrl}/movie/${id}/rating`)
  return res.data
}

const getReview = async (userId, movieId) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.get(`${baseUrl}/${userId}&${movieId}`, config)
  return res.data
}

const deleteReview = async (id) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.delete(`${baseUrl}/${id}`, config)
  return res.data
}

const editReview = async (id, review) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.put(`${baseUrl}/${id}`, review, config)
  return res.data
}

export default {
  createReview,
  getUserReviews,
  getMovieReviews,
  getMovieRating,
  getReview,
  deleteReview,
  editReview
}