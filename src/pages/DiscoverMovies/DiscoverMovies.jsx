import { Container, Typography, Grid, Stack, Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import watchlistsService from '../../services/watchlists'
import reviewsService from '../../services/reviews'
import moviesService from '../../services/movies'
import Progress from '../../components/Progress'
import MovieCard from '../../components/MovieCard'
import ReviewDialog from '../../components/ReviewDialog'
import SearchFormAdvanced from './components/SearchFormAdvanced'

const DiscoverMovies = ({ user, addToWatchlist, removeFromWatchlist, isMobile }) => {

  const moviesList = useParams()
  const [movies, setMovies] = useState([null])
  const [addedOrRemoved, setAddedOrRemoved] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [movie, setMovie] = useState(null)
  const [review, setReview] = useState(null)
  const [edit, setEdit] = useState(false)
  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])
  const [totalResults, setTotalResults] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [movieFilter, setMovieFilter] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if(searchParams.size > 0) {
      const releaseDateMin = searchParams.get('release_date_gte') === 'null'
        ? ''
        : searchParams.get('release_date_gte')
      const releaseDateMax = searchParams.get('release_date_lte') === 'null'
        ? ''
        : searchParams.get('release_date_lte')
      moviesService.discoverMovies({
        sort_by: searchParams.get('sort_by'),
        with_genres: searchParams.getAll('with_genres'),
        with_runtime_gte: searchParams.get('with_runtime_gte'),
        with_runtime_lte: searchParams.get('with_runtime_lte'),
        release_date_gte: releaseDateMin,
        release_date_lte: releaseDateMax,
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
        .catch(error => {
          console.log(error)
        })
    } else {
      moviesService.getTopRated()
        .then(response => {
          setMovies(response.results)
          setTotalPages(1)
          setTotalResults(null)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [searchParams, moviesList.page, addedOrRemoved])

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
    setMovieFilter('')
    navigate(`/discover/${value}?${searchParams.toString()}`)
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

  if (movies.length === 0 && totalResults > 0) {
    navigate(`/discover/1?${searchParams.toString()}`)
  }

  const filteredMovies = movies
    .filter((movie) => movie.title.toLowerCase().includes(movieFilter.toLowerCase()))

  return (
    <Container>
      <SearchFormAdvanced
        movieFilter={movieFilter}
        setMovieFilter={setMovieFilter}
        isMobile={isMobile}
      />
      {(totalResults === 0) &&
        <Typography variant='h6' fontWeight='bold' gutterBottom sx={{ mb: 2 }}>
          Could not find any movies :(
        </Typography>
      }
      {(totalResults > 0) &&
        <Typography variant='h6' fontWeight='bold' gutterBottom sx={{ mb: 2 }}>
          {totalResults} Movies matched your search
        </Typography>
      }
      {(totalResults === null) &&
        <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 1.5, mb: 2 }}>
          Discover movies
        </Typography>
      }
      <Grid container spacing={4} columns={18} sx={{ mb: 4 }}>
        {filteredMovies.map((movie) => (
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
      {(movies.length > 0 && totalPages > 1) &&
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