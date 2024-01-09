import axios from 'axios'
const baseUrl = '/api/users'

const getToken = () => {
  return `Bearer ${JSON.parse(window.localStorage.getItem('loggedTMSUser')).token}`
}

const getAllUsers = async () => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.get(`${baseUrl}/admin`, config)
  return res.data
}

const getUsers = async () => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.get(baseUrl, config)
  return res.data
}

const getUser = async (id) => {
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

const editUser = async (id, user) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.put(`${baseUrl}/${id}/admin`, user, config)
  return res.data
}

const editDisabled = async (id, user) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.put(`${baseUrl}/${id}`, user, config)
  return res.data
}

const removeUser = async (id) => {
  const config = {
    headers: { Authorization: getToken() }
  }
  await axios.delete(`${baseUrl}/${id}`, config)
}

export default {
  getAllUsers,
  getUsers,
  signUp,
  getUser,
  editUser,
  editDisabled,
  removeUser
}