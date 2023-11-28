import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [imgConfig, setImgConfig] = useState([])
  const [movies, setMovies] = useState([])
  const APIKEY = import.meta.env.VITE_TMDB_APIKEY
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
    axios.get(`https://api.themoviedb.org/3/movie/13?api_key=${APIKEY}`)
      .then(response => {
        setMovies(response.data)
      })
  }, [])

  if (!movies || !imgConfig) return null

  return (
    <>
      <h1>{movies.original_title}</h1>
      <h4>{movies.release_date}</h4>
      <img src={`${imgConfig.base_url}/${imgConfig.poster_sizes[2]}/${movies.poster_path}`}></img><br />
    </>
  )
}

export default App
