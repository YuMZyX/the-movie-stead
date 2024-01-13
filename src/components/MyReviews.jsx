import { Typography, Grid, Container, Box } from '@mui/material'
import { useEffect, useState } from 'react'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'
import Progress from './Progress'
import ReviewCard from './ReviewCard'
import ReviewDialog from './ReviewDialog'
import FilterSort from './FilterSort'
import Redirect from './Redirect'
import { useParams } from 'react-router-dom'

const sortItems = [
  { value: 'Date, DESC', selectText: 'Date added, descending' },
  { value: 'Date, ASC', selectText: 'Date added, ascending' },
  { value: 'Title, DESC', selectText: 'Movie title, A - Z' },
  { value: 'Title, ASC', selectText: 'Movie title, Z - A' },
  { value: 'Rating, DESC', selectText: 'Your rating, descending' },
  { value: 'Rating, ASC', selectText: 'Your rating, ascending' },
]

const MyReviews = ({ user, addToWatchlist, removeFromWatchlist,
  isMobile, isTablet }) => {

  const userParam = useParams()
  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])
  const [addedOrRemoved, setAddedOrRemoved] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [movie, setMovie] = useState(null)
  const [review, setReview] = useState(null)
  const [edit, setEdit] = useState(false)
  const [reviewFilter, setReviewFilter] = useState('')
  const [sortOption, setSortOption] = useState('Date, DESC')

  useEffect(() => {
    if (user) {
      if (user.role === 'moderator' || user.role === 'admin') {
        reviewsService.getUserReviews(userParam.id)
          .then(response => {
            setReviews(response)
          })
          .catch (error => {
            console.log(error)
          })
      } else {
        reviewsService.getUserReviews(user.id)
          .then(response => {
            setReviews(response)
          })
          .catch (error => {
            console.log(error)
          })
      }
      watchlistsService.getWatchlistMovies(user.id)
        .then(response => {
          setWatchlist(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [user, addedOrRemoved, userParam])

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

  const handleSortChange = (event) => {
    setSortOption(event.target.value)
  }
  const handleFilterChange = (event) => {
    setReviewFilter(event.target.value)
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
  if (reviews.count === 0) {
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

  const filterSortReviews = reviews.rows
    .filter((review) => review.movie.title.toLowerCase().includes(reviewFilter.toLowerCase()))
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
      case 'Rating, DESC':
        return b.rating - a.rating
      case 'Rating, ASC':
        return a.rating - b.rating
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  return (
    <Container>
      {user.id === parseInt(userParam.id)
        ?
        <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 2 }}>
          Your reviews
        </Typography>
        :
        <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 2 }}>
          Reviews of user {userParam.id}
        </Typography>
      }
      <FilterSort
        filter={reviewFilter}
        sortOption={sortOption}
        handleFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
        sortItems={sortItems}
        label='Filter reviews'
        isMobile={isMobile}
      />
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {filterSortReviews.map((reviewItem) => (
          <Grid item key={reviewItem.id} xs={6} sm={4} md={3} style={{ display: 'flex' }}>
            <ReviewCard
              movie={reviewItem.movie}
              watchlist={watchlist.rows}
              review={reviewItem}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
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

export default MyReviews