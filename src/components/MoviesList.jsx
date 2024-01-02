import { Typography, Grid, Container, Stack,
  Pagination } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import moviesService from '../services/movies'
import Progress from './Progress'
import MovieCard from './MovieCard'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'
import ReviewDialog from './ReviewDialog'

const MoviesList = ({ user, addToWatchlist, removeFromWatchlist }) => {

  const moviesList = useParams()
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(null)
  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])
  const [addedOrRemoved, setAddedOrRemoved] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [movie, setMovie] = useState(null)

  useEffect(() => {
    moviesService.getTrending(moviesList.page)
      .then(response => {
        setMovies(response.results)
        if (response.total_pages >= 20) {
          setTotalPages(20)
        } else {
          setTotalPages(response.total_pages)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [moviesList.page, addedOrRemoved])

  useEffect(() => {
    if (user) {
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
    }
  }, [moviesList.page, user, addedOrRemoved])

  const handleAddToWatchlist = async (movie) => {
    await addToWatchlist(movie)
    setAddedOrRemoved(movie.id)
  }
  const handleRemoveFromWatchlist = async (watchlistId, movie) => {
    await removeFromWatchlist(watchlistId, movie)
    setAddedOrRemoved(watchlistId)
  }

  const handleCreateReview = async (movie) => {
    setMovie(movie)
    handleOpenDialog()
  }

  const handlePageChange = (event, value) => {
    navigate(`/trending/${value}`)
  }
  const handleOpenDialog = () => {
    setReviewDialogOpen(true)
  }
  const handleCloseDialog = () => {
    setReviewDialogOpen(false)
  }

  if (
    !movies
    || movies.length === 0
    || (user && (!watchlist || watchlist[0] === null))
    || (user && (!reviews || reviews[0] === null))
  ) {
    return (
      <Progress />
    )
  }

  return (
    <Container>
      <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 2, mb: 2 }}>
        Trending movies
      </Typography>
      <Grid container spacing={4} columns={20} sx={{ mb: 4 }}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={10} sm={6} md={5} lg={4} style={{ display: 'flex' }}>
            <MovieCard
              key={movie.id}
              movie={movie}
              watchlist={watchlist}
              reviews={reviews}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              createReview={handleCreateReview}
              user={user}
            />
          </Grid>
        ))}
      </Grid>
      <ReviewDialog
        open={reviewDialogOpen}
        handleCloseDialog={handleCloseDialog}
        user={user}
        movie={movie}
        setAddedOrRemoved={setAddedOrRemoved}
      />
      <Stack spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
        <Pagination
          count={totalPages}
          page={parseInt(moviesList.page)}
          onChange={handlePageChange}
          variant='outlined'
          showFirstButton
          showLastButton
          color='primary'
        />
      </Stack>
    </Container>
  )
}

export default MoviesList