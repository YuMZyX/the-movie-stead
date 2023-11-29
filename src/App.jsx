import { useState, useEffect } from 'react'
import { Container } from '@mui/material'
import axios from 'axios'
import Movies from './components/Movies'
import Login from './components/Login'

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
        console.log(movies)
      })
  }, [])

  if (!movies || !imgConfig) {
    return null
  }

  const test = true

  if (test) {
    return (
      <Login />
    )
  }

  return (
    <Container>
      <Movies movies={movies} />
    </Container>
  )
}

export default App
