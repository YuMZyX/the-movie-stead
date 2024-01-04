import axios from 'axios'
const baseUrl = '/api'

const login = async (credentials) => {
  const res = await axios.post(`${baseUrl}/login`, credentials)
  return res.data
}

const logout = async () => {
  const user = JSON.parse(window.localStorage.getItem('loggedTMSUser'))
  if (user) {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    }
    const res = await axios.delete(`${baseUrl}/logout`, config)
    return res.data
  } else {
    throw new Error('User not found.')
  }
}

export default { login, logout }