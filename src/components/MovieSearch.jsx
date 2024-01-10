import { Container, Typography, Grid, Stack, Pagination } from '@mui/material'
import SearchForm from './SearchForm'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import moviesService from '../services/movies'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'
import Progress from './Progress'
import MovieCard from './MovieCard'
import ReviewDialog from './ReviewDialog'

const MovieSearch = ({ user, addToWatchlist, removeFromWatchlist, isMobile }) => {

  const moviesList = useParams()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(null)
  const [year, setYear] = useState(null)
  const [movies, setMovies] = useState([null])
  const [totalResults, setTotalResults] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [addedOrRemoved, setAddedOrRemoved] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [movie, setMovie] = useState(null)
  const [review, setReview] = useState(null)
  const [edit, setEdit] = useState(false)
  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])
  const navigate = useNavigate()

  useEffect(() => {
    setSearch(searchParams.get('q'))
    if (searchParams.get('y')) {
      const yearParam = new Date(searchParams.get('y'))
      setYear(yearParam)
    } else {
      setYear(null)
    }
  }, [searchParams])

  useEffect(() => {
    if (search) {
      moviesService.searchMovies({
        search: search,
        year: year
      }, moviesList.page)
        .then(response => {
          setMovies(response.results)
          if (response.total_pages >= 20) {
            setTotalPages(20)
          } else {
            setTotalPages(response.total_pages)
          }
          setTotalResults(response.total_results)
        })
    } else if (!searchParams.get('q')) {
      setMovies([])
    }
  }, [moviesList.page, addedOrRemoved, search, year])

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
    if (year) {
      const yearParam = year.getFullYear()
      navigate(`/moviesearch/${value}?q=${search}&y=${yearParam}`)
    } else {
      navigate(`/moviesearch/${value}?q=${search}`)
    }
  }
  const handleOpenDialog = () => {
    setReviewDialogOpen(true)
  }
  const handleCloseDialog = () => {
    setReviewDialogOpen(false)
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

  return (
    <Container>
      <SearchForm
        setMovies={setMovies}
        setAddedOrRemoved={setAddedOrRemoved}
        isMobile={isMobile}
      />
      {(movies.length > 0 && totalResults > 0) &&
        <Typography variant='h6' fontWeight='bold' gutterBottom sx={{ mt: 1.5, mb: 2 }}>
          {totalResults} Movies matched your search
        </Typography>
      }
      {(totalResults === 0) &&
        <Typography variant='h6' fontWeight='bold' gutterBottom sx={{ mt: 1.5, mb: 2 }}>
          Could not find any movies :(
        </Typography>
      }
      <Grid container spacing={4} columns={18} sx={{ mb: 4 }}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={9} sm={6} md={4.5} lg={3.6} style={{ display: 'flex' }}>
            <MovieCard
              movie={movie}
              user={user}
              watchlist={watchlist.rows}
              reviews={reviews.rows}
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

export default MovieSearch