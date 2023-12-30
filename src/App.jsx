import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import MoviesList from './components/MoviesList'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Navbar from './components/Navbar'
import sessionService from './services/sessions'
import { useNavigate } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import Movie from './components/Movie'
import NotFound from './components/NotFound'
import Watchlist from './components/Watchlist'

const App = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await sessionService.logout()
    } catch (error) {
      console.log(error)
      window.localStorage.removeItem('loggedTMSUser')
      setUser(null)
      navigate('/login')
    }
    window.localStorage.removeItem('loggedTMSUser')
    setUser(null)
    navigate('/login')
  }

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedTMSUser'))
    setUser(user)
  }, [])

  return (
    <>
      <Navbar handleLogout={handleLogout} user={user} />
      <Routes>
        <Route path='/trending/:page' element={<MoviesList user={user} />} />
        <Route path='/movies/:id' element={<Movie user={user} />} />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/signup' element={<SignUp setUser={setUser} />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<User user={user} />} />
        <Route path='/watchlist/:id' element={<Watchlist user={user} />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
