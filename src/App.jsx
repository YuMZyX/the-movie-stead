import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Movies from './components/Movies'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Navbar from './components/Navbar'
import sessionService from './services/sessions'
import { useNavigate } from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import Progress from './components/Progress'

const App = () => {
  const [movies, setMovies] = useState([])
  const [user, setUser] = useState(null)
  //const APIKEY = import.meta.env.VITE_TMDB_APIKEY
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN
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

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    }
  }

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedTMSUser'))
    setUser(user)
  }, [])

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options)
      .then(response => {
        setMovies(response.data.results)
      })
  }, [])

  if (!movies) {
    return (
      <Progress />
    )
  }

  return (
    <>
      <Navbar handleLogout={handleLogout} user={user} />
      <Routes>
        <Route path='/' element={<Movies movies={movies} />} />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/signup' element={<SignUp setUser={setUser} />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<User user={user} />} />
      </Routes>
    </>
  )
}

export default App
