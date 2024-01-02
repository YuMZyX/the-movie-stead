import { Typography, Grid, Container, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import Progress from './Progress'
import MovieCard from './MovieCard'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'

const Watchlist = ({ user, addToWatchlist, removeFromWatchlist }) => {

  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])
  const [removedOrAdded, setRemovedOrAdded] = useState(null)

  useEffect(() => {
    watchlistsService.getWatchlistMovies(user.id)
      .then(response => {
        setWatchlist(response)
      })
      .catch(error => {
        console.log(error)
      })
    reviewsService.getUserReviews(user.id)
      .then(response => {
        setReviews(response)
      })
      .catch (error => {
        console.log(error)
      })
  }, [user, removedOrAdded])

  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie)
  }
  const handleRemoveFromWatchlist = async (watchlistId, movie) => {
    await removeFromWatchlist(watchlistId, movie)
    setRemovedOrAdded(watchlistId)
  }

  if (
    !watchlist
    || watchlist[0] === null
    || ! reviews
    || reviews[0] === null
  ) {
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
              reviews={reviews}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              user={user}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Watchlist