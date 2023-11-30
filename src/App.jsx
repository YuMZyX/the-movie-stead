import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'
import Movies from './components/Movies'
import Login from './components/Login'
import SignUp from './components/SignUp'

const App = () => {
  const [imgConfig, setImgConfig] = useState([])
  const [movies, setMovies] = useState([])
  //const APIKEY = import.meta.env.VITE_TMDB_APIKEY
  const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_TOKEN}`
    }
  }

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/configuration', options)
      .then(response => {
        setImgConfig(response.data.images)
      })
  }, [])

  useEffect(() => {
    axios.get('https://api.themoviedb.org/3/trending/movie/week?language=en-US', options)
      .then(response => {
        setMovies(response.data.results)
      })
  }, [])

  if (!movies || !imgConfig) {
    return null
  }

  return (
    <Routes>
      <Route path='/' element={<Movies movies={movies} />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />
    </Routes>
  )
}

export default App
