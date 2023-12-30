import { Typography, Grid, Container, Box } from '@mui/material'
//import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
//import moviesService from '../services/movies'
import Progress from './Progress'
import MovieCard from './MovieCard'
import watchlistsService from '../services/watchlists'
import { useSnackbar } from 'notistack'

const Watchlist = ({ user }) => {

  //const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [watchlist, setWatchlist] = useState([null])

  useEffect(() => {
    watchlistsService.getWatchlist(user.id)
      .then(response => {
        setWatchlist(response)
      })
      .catch(error => {
        console.log(error)
      })
  }, [user])

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

  if (!watchlist || watchlist[0] === null) {
    return (
      <Progress />
    )
  }
  if (watchlist.length === 0) {
    return (
      <Container>
        <Box sx={{ mt: 2, ml: 2 }}>
          <Typography variant='h6'>
            Your watchlist is currently empty
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 2, mb: 2 }}>
        Your watchlist
      </Typography>
      <Grid container spacing={4} columns={20} sx={{ mb: 4 }}>
        {watchlist.map((wl) => (
          <Grid item key={wl.movieId} xs={10} sm={6} md={5} lg={4} style={{ display: 'flex' }}>
            <MovieCard
              key={wl.movieId}
              movie={wl.movie}
              watchlist={watchlist}
              addToWatchlist={handleAddToWatchlist}
              user={user}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Watchlist

/*
<Grid container spacing={4} columns={20} sx={{ mb: 4 }}>
        {watchlist.map((watchlist) => (
          <Grid item key={watchlist.id} xs={10} sm={6} md={5} lg={4} style={{ display: 'flex' }}>
            <MovieCard
              key={watchlist.movieId}
              movie={watchlist.movie}
              addToWatchlist={handleRemoveFromWatchlist}
              user={user}
            />
          </Grid>
        ))}
      </Grid>
*/