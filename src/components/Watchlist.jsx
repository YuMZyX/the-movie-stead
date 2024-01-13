import { Typography, Grid, Container, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import Progress from './Progress'
import MovieCard from './MovieCard'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'
import ReviewDialog from './ReviewDialog'
import FilterSort from './FilterSort'
import Redirect from './Redirect'

const sortItems = [
  { value: 'Date, DESC', selectText: 'Date added, descending' },
  { value: 'Date, ASC', selectText: 'Date added, ascending' },
  { value: 'Title, DESC', selectText: 'Movie title, A - Z' },
  { value: 'Title, ASC', selectText: 'Movie title, Z - A' },
]

const Watchlist = ({ user, addToWatchlist, removeFromWatchlist, isMobile, isTablet }) => {

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

  if (!user) {
    return <Redirect />
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
  if (watchlist.count === 0) {
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

  const filterSortWatchlist = watchlist.rows
    .filter((wl) => wl.movie.title.toLowerCase().includes(wlFilter.toLowerCase()))
    .sort((a, b) => {
      switch (sortOption) {
      case 'Date, DESC':
        return new Date(b.createdAt) - new Date(a.createdAt)
      case 'Date, ASC':
        return new Date(a.createdAt) - new Date(b.createdAt)
      case 'Title, DESC':
        return a.movie.title.localeCompare(b.movie.title)
      case 'Title, ASC':
        return b.movie.title.localeCompare(a.movie.title)
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  return (
    <Container>
      <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 2 }}>
        Your watchlist
      </Typography>
      <FilterSort
        filter={wlFilter}
        sortOption={sortOption}
        handleFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
        sortItems={sortItems}
        label='Filter watchlist'
        isMobile={isMobile}
      />
      <Grid container spacing={4} columns={18} sx={{ mb: 4 }}>
        {filterSortWatchlist.map((wl) => (
          <Grid item key={wl.movieId} xs={9} sm={6} md={4.5} lg={3.6} style={{ display: 'flex' }}>
            <MovieCard
              movie={wl.movie}
              watchlist={watchlist.rows}
              reviews={reviews.rows}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              createReview={handleCreateReview}
              editReview={handleEditReview}
              user={user}
              isMobile={isMobile}
              isTablet={isTablet}
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