import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import MoviesList from './pages/MoviesList'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Navbar from './components/Navbar'
import sessionService from './services/sessions'
import Users from './pages/Users/Users'
import User from './pages/User'
import Movie from './pages/Movie'
import NotFound from './pages/NotFound'
import Watchlist from './pages/Watchlist'
import watchlistsService from './services/watchlists'
import { useSnackbar } from 'notistack'
import MyReviews from './pages/MyReviews/MyReviews'
import MovieSearch from './pages/MovieSearch'
import DiscoverMovies from './pages/DiscoverMovies/DiscoverMovies'
import StarsList from './pages/StarsList/StarsList'
import Person from './pages/Person'
import Footer from './components/Footer'
import { Box } from '@mui/material'

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
        poster_path: movie.poster_path || 'NO_POSTER'
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

  const isMobile = windowDimension <= 600
  const isTablet = windowDimension <= 900 && windowDimension > 600

  return (
    <Box sx={{ minHeight: '98vh', display: 'flex', flexDirection: 'column' }}>
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
              isTablet={isTablet}
            />}
        />
        <Route
          path='/stars/trending/:page'
          element={<StarsList isMobile={isMobile} />}
        />
        <Route
          path='/movies/:id'
          element={
            <Movie
              user={user}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              isMobile={isMobile}
            />}
        />
        <Route path='/stars/:id' element={<Person isMobile={isMobile} isTablet={isTablet} />} />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/signup' element={<SignUp setUser={setUser} />} />
        <Route path='/users' element={<Users user={user} />} />
        <Route path='/users/:id' element={<User user={user} />} />
        <Route
          path='/watchlist/:id'
          element={
            <Watchlist
              user={user}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              isMobile={isMobile}
              isTablet={isTablet}
            />}
        />
        <Route
          path='/myreviews/:id'
          element={
            <MyReviews
              user={user}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              isMobile={isMobile}
              isTablet={isTablet}
            />}
        />
        <Route
          path='/moviesearch/:page'
          element={
            <MovieSearch
              user={user}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              isMobile={isMobile}
              isTablet={isTablet}
            />}
        />
        <Route
          path='/discover/:page'
          element={
            <DiscoverMovies
              user={user}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              isMobile={isMobile}
              isTablet={isTablet}
            />}
        />
        <Route path='*' element={<NotFound />} />
      </Routes>
      <Footer isMobile={isMobile} />
    </Box>
  )
}

export default App
