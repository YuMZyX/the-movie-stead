import axios from 'axios'
const baseUrl = '/api'

const getToken = () => {
  return `Bearer ${JSON.parse(window.localStorage.getItem('loggedTMSUser')).token}`
}

const login = async (credentials) => {
  const res = await axios.post(`${baseUrl}/login`, credentials)
  return res.data
}

const logout = async () => {
  const config = {
    headers: { Authorization: getToken() }
  }
  const res = await axios.delete(`${baseUrl}/logout`, config)
  return res.data
}

export default { login, logout }