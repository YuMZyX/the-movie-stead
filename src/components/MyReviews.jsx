import { Typography, Grid, Container, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'
import Progress from './Progress'
import ReviewCard from './ReviewCard'
import ReviewDialog from './ReviewDialog'

const MyReviews = ({ user, addToWatchlist, removeFromWatchlist }) => {

  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])
  const [addedOrRemoved, setAddedOrRemoved] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [movie, setMovie] = useState(null)
  const [review, setReview] = useState(null)
  const [edit, setEdit] = useState(false)

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

  const handleAddToWatchlist = async (movie) => {
    await addToWatchlist(movie)
    setAddedOrRemoved(movie.id)
  }
  const handleRemoveFromWatchlist = async (watchlistId, movie) => {
    await removeFromWatchlist(watchlistId, movie)
    setAddedOrRemoved(watchlistId)
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
  if (reviews.length === 0) {
    return (
      <Container>
        <Box sx={{ mt: 2, ml: 2 }}>
          <Typography variant='h6'>
            You have not reviewed any movies yet
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 2, mb: 2 }}>
        Your reviews
      </Typography>
      <Grid container spacing={4} columns={20} sx={{ mb: 4 }}>
        {reviews.map((reviewItem) => (
          <Grid item key={reviewItem.id} xs={10} sm={7} md={6} lg={5} style={{ display: 'flex' }}>
            <ReviewCard
              movie={reviewItem.movie}
              watchlist={watchlist}
              review={reviewItem}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
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

export default MyReviews