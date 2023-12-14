import axios from 'axios'
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/movies`

const getTrending = async () => {
  const res = await axios.get(`${baseUrl}/trending`)
  return res.data
}

const getMovie = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`)
  return res.data
}

const getMovieCredits = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}/credits`)
  return res.data
}

export default { getTrending, getMovie, getMovieCredits }