import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import MoviesList from './components/MoviesList'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Navbar from './components/Navbar'
import sessionService from './services/sessions'
import Users from './components/Users'
import User from './components/User'
import Movie from './components/Movie'
import NotFound from './components/NotFound'
import Watchlist from './components/Watchlist'
import watchlistsService from './services/watchlists'
import { useSnackbar } from 'notistack'
import MyReviews from './components/MyReviews'

const App = () => {
  const [windowDimension, setWindowDimension] = useState(null)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const user = JSON.parse(window.localStorage.getItem('loggedTMSUser'))
    setUser(user)
  }, [])

  useEffect(() => {
    setWindowDimension(window.innerWidth)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

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

  const handleAddToWatchlist = async (movie) => {
    try {
      await watchlistsService.addToWatchlist({
        user_id: user.id,
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path
      })
      enqueueSnackbar(`${movie.title} has been added to your watchlist`,
        { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(`${movie.title} ${error.response.data}`,
        { variant: 'warning' })
    }
  }

  const handleRemoveFromWatchlist = async (watchlistId, movie) => {
    try {
      await watchlistsService.removeFromWatchlist(watchlistId)
      enqueueSnackbar(`${movie.title} has been removed from your watchlist`,
        { variant: 'info' })
    } catch (error) {
      enqueueSnackbar(`${movie.title} ${error.response.data}`,
        { variant: 'error' })
    }
  }

  const isMobile = windowDimension <= 640
  const isTablet = windowDimension < 1280 && windowDimension > 640

  return (
    <>
      <Navbar
        handleLogout={handleLogout}
        user={user}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <Routes>
        <Route path='/' element={<Navigate to='/trending/1' />} />
        <Route
          path='/trending/:page'
          element={
            <MoviesList
              user={user}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              isMobile={isMobile}
            />}
        />
        <Route
          path='/movies/:id'
          element={
            <Movie
              user={user}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
            />}
        />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/signup' element={<SignUp setUser={setUser} />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<User user={user} />} />
        <Route
          path='/watchlist/:id'
          element={
            <Watchlist
              user={user}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
            />}
        />
        <Route
          path='/myreviews/:id'
          element={
            <MyReviews
              user={user}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
            />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
