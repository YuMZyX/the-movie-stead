import axios from 'axios'
const baseUrl = '/api/stars'

const getTrending = async (page) => {
  const res = await axios.get(`${baseUrl}/trending/${page}`)
  return res.data
}

const getStar = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`)
  return res.data
}

const searchStars = async (query, page) => {
  const queryObject = JSON.stringify(query)
  const res = await axios.get(`${baseUrl}/search/${queryObject}&${page}`)
  return res.data
}

export default {
  getTrending,
  getStar,
  searchStars
}