import { Container, Typography, Grid, Stack, Pagination } from '@mui/material'
import FilterSort from './FilterSort'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
//import moviesService from '../services/movies'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'
import Progress from './Progress'
import MovieCard from './MovieCard'
import ReviewDialog from './ReviewDialog'

const sortItems = [
  { value: 'Popularity, DESC', selectText: 'Popularity, descending' },
  { value: 'Popularity, ASC', selectText: 'Popularity, ascending' },
  { value: 'Date, DESC', selectText: 'Release date, descending' },
  { value: 'Date, ASC', selectText: 'Release date, ascending' },
  { value: 'Title, DESC', selectText: 'Movie title, A - Z' },
  { value: 'Title, ASC', selectText: 'Movie title, Z - A' },
]

const DiscoverMovies = ({ user, addToWatchlist, removeFromWatchlist, isMobile }) => {

  const moviesList = useParams()
  const [movieFilter, setMovieFilter] = useState('')
  const [movies, setMovies] = useState([null])
  const [addedOrRemoved, setAddedOrRemoved] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [movie, setMovie] = useState(null)
  const [review, setReview] = useState(null)
  const [edit, setEdit] = useState(false)
  const [sortOption, setSortOption] = useState('Popularity, DESC')
  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])
  const [totalResults, setTotalResults] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const navigate = useNavigate()

  setTotalResults(0)
  setTotalPages(0)

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
    setMovies([null])
    navigate(`/moviesearch/${value}`)
  }
  const handleOpenDialog = () => {
    setReviewDialogOpen(true)
  }
  const handleCloseDialog = () => {
    setReviewDialogOpen(false)
  }

  const handleFilterChange = (event) => {
    setMovieFilter(event.target.value)
  }
  const handleSortChange = (event) => {
    setSortOption(event.target.value)
  }

  if (
    !movies
    || movies[0] === null
    || (user && (!watchlist || watchlist[0] === null))
    || (user && (!reviews || reviews[0] === null))
  ) {
    return (
      <Progress />
    )
  }
  console.log(movies)

  const filterSortMovies = movies
    .sort((a, b) => {
      switch (sortOption) {
      case 'Popularity, DESC':
        return b.popularity - a.popularity
      case 'Popularity, ASC':
        return a.popularity - b.popularity
      case 'Date, DESC':
        return new Date(b.release_date) - new Date(a.release_date)
      case 'Date, ASC':
        return new Date(a.release_date) - new Date(b.release_date)
      case 'Title, DESC':
        return a.title.localeCompare(b.title)
      case 'Title, ASC':
        return b.title.localeCompare(a.title)
      default:
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  return (
    <Container>
      <FilterSort
        label='Search for a movie'
        sortItems={sortItems}
        filter={movieFilter}
        sortOption={sortOption}
        handleFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
      />
      {(movies.length > 0 && totalResults > 0) &&
        <Typography variant='h6' fontWeight='bold' gutterBottom sx={{ mt: 2, mb: 2 }}>
          {totalResults} Movies matched your search
        </Typography>
      }
      {(totalResults === 0) &&
        <Typography variant='h6' fontWeight='bold' gutterBottom sx={{ mt: 2, mb: 2 }}>
          Could not find any movies :(
        </Typography>
      }
      <Grid container spacing={4} columns={18} sx={{ mb: 4 }}>
        {filterSortMovies.map((movie) => (
          <Grid item key={movie.id} xs={9} sm={6} md={4.5} lg={3.6} style={{ display: 'flex' }}>
            <MovieCard
              movie={movie}
              user={user}
              watchlist={watchlist}
              reviews={reviews}
              addToWatchlist={handleAddToWatchlist}
              removeFromWatchlist={handleRemoveFromWatchlist}
              createReview={handleCreateReview}
              editReview={handleEditReview}
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
      {movies.length > 0 &&
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
      }
    </Container>
  )
}

export default DiscoverMovies