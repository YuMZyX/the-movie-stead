import axios from 'axios'
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/users`

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const signUp = async (credentials) => {
  const res = await axios.post(baseUrl, credentials)
  return res.data
}

export default { getAll, signUp }