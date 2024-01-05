import { Typography, Grid, Container, Stack, Button,
  Pagination, TextField, IconButton, Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import moviesService from '../services/movies'
import Progress from './Progress'
import MovieCard from './MovieCard'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'
import ReviewDialog from './ReviewDialog'
import { SearchOutlined } from '@mui/icons-material'

const MoviesList = ({ user, addToWatchlist, removeFromWatchlist, isMobile }) => {

  const moviesList = useParams()
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(null)
  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])
  const [addedOrRemoved, setAddedOrRemoved] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [movie, setMovie] = useState(null)
  const [review, setReview] = useState(null)
  const [edit, setEdit] = useState(false)
  const [movieSearch, setMovieSearch] = useState('')

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
    setReview({
      rating: null,
      review_text: null
    })
    handleOpenDialog()
  }
  const handleEditReview = async (movie, review) => {
    setMovie(movie)
    setReview({
      id: review.id,
      rating: review.rating,
      review_text: review.reviewText
    })
    setEdit(true)
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

  const handleMovieSearch = (event) => {
    event.preventDefault()
    console.log(movieSearch)
    setMovieSearch('')
  }
  const handleSearchChange = (event) => {
    setMovieSearch(event.target.value)
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
      <Box sx={{ display: 'flex', mt: 2 }}>
        <Box component='form' onSubmit={handleMovieSearch} sx={{ flexGrow: 1 }}>
          <TextField
            fullWidth
            label='Search for a movie...'
            value={movieSearch}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <IconButton type='submit'>
                  <SearchOutlined />
                </IconButton>
              )
            }}
          />
        </Box>
        <Button
          variant='contained'
          sx={{ ml: 2, color: 'secondary.main' }}
          onClick={() => navigate('/')}
        >
          Advanced search
        </Button>
      </Box>
      <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 2, mb: 2 }}>
        Trending movies
      </Typography>
      <Grid container spacing={4} columns={18} sx={{ mb: 4 }}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={9} sm={6} md={4.5} lg={3.6} style={{ display: 'flex' }}>
            <MovieCard
              movie={movie}
              watchlist={watchlist}
              reviews={reviews}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              createReview={handleCreateReview}
              editReview={handleEditReview}
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
        review={review}
        edit={edit}
        setAddedOrRemoved={setAddedOrRemoved}
        setEdit={setEdit}
      />
      <Stack spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
        <Pagination
          count={totalPages}
          page={parseInt(moviesList.page)}
          onChange={handlePageChange}
          variant='outlined'
          showFirstButton
          showLastButton
          hidePrevButton={isMobile}
          hideNextButton={isMobile}
          color='primary'
        />
      </Stack>
    </Container>
  )
}

export default MoviesList