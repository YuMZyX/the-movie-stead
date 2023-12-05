import axios from 'axios'
const baseUrl = `${import.meta.env.VITE_BACKEND_URL}/users`

const getToken = () => {
  return `Bearer ${JSON.parse(window.localStorage.getItem('loggedTMSUser')).token}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.get(baseUrl, config)
  return res.data
}

const getOne = async (id) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.get(`${baseUrl}/${id}`, config)
  return res.data
}

const signUp = async (credentials) => {
  const res = await axios.post(baseUrl, credentials)
  return res.data
}

const edit = async (id, newObject) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.put(`${baseUrl}/${id}`, newObject, config)
  return res.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default { getAll, signUp, getOne, edit, remove }