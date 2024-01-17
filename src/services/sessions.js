import axios from 'axios'
const baseUrl = '/api'

const login = async (credentials) => {
  const res = await axios.post(`${baseUrl}/login`, credentials)
  return res.data
}

const logout = async (id) => {
  const res = await axios.delete(`${baseUrl}/logout/${id}`)
  return res.data
}

export default { login, logout }