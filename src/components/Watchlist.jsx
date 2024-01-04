import { Typography, Grid, Container, Box, TextField,
  Select, MenuItem, FormControl, InputLabel,
  InputAdornment } from '@mui/material'
import { useEffect, useState } from 'react'
import Progress from './Progress'
import MovieCard from './MovieCard'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'
import { SearchRounded } from '@mui/icons-material'
import ReviewDialog from './ReviewDialog'

const Watchlist = ({ user, addToWatchlist, removeFromWatchlist }) => {

  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])
  const [addedOrRemoved, setAddedOrRemoved] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [movie, setMovie] = useState(null)
  const [review, setReview] = useState(null)
  const [edit, setEdit] = useState(false)
  const [wlFilter, setWlFilter] = useState('')
  const [sortOption, setSortOption] = useState('Date, DESC')

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
  }, [user, addedOrRemoved])

  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie)
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

  const handleOpenDialog = () => {
    setReviewDialogOpen(true)
  }
  const handleCloseDialog = () => {
    setReviewDialogOpen(false)
  }

  const handleSortChange = (event) => {
    setSortOption(event.target.value)
  }
  const handleFilterChange = (event) => {
    setWlFilter(event.target.value)
  }

  if (
    !watchlist
    || watchlist[0] === null
    || !reviews
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

  const filterSortWatchlist = watchlist
    .filter((wl) => wl.movie.title.toLowerCase().includes(wlFilter.toLowerCase()))

  return (
    <Container>
      <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 2, mb: 2 }}>
        Your watchlist
      </Typography>
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          label='Filter watchlist'
          sx={{ mr: 2 }}
          fullWidth
          value={wlFilter}
          onChange={handleFilterChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <SearchRounded />
              </InputAdornment>
            )
          }}
        />
        <FormControl sx={{ minWidth: 230 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortOption}
            onChange={handleSortChange}
            label='Sort by'
          >
            <MenuItem value='Date, DESC'>Date added, descending</MenuItem>
            <MenuItem value='Date, ASC'>Date added, ascending</MenuItem>
            <MenuItem value='Title, DESC'>Movie title, descending</MenuItem>
            <MenuItem value='Title, ASC'>Movie title, descending</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={4} columns={20} sx={{ mb: 4 }}>
        {filterSortWatchlist.map((wl) => (
          <Grid item key={wl.movieId} xs={10} sm={6} md={5} lg={4} style={{ display: 'flex' }}>
            <MovieCard
              movie={wl.movie}
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
    </Container>
  )
}

export default Watchlist