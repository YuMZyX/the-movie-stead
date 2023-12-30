import { Typography, Grid, Container, Stack,
  Pagination } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import moviesService from '../services/movies'
import Progress from './Progress'
import MovieCard from './MovieCard'
import watchlistsService from '../services/watchlists'
import { useSnackbar } from 'notistack'

const MoviesList = ({ user }) => {

  const moviesList = useParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(null)
  const [watchlist, setWatchlist] = useState([null])

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
  }, [moviesList.page])

  useEffect(() => {
    if (user) {
      watchlistsService.getWatchlist(user.id)
        .then(response => {
          setWatchlist(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [moviesList.page, user])

  const handleAddToWatchlist = async (movie) => {
    try {
      await watchlistsService.addToWatchlist({
        user_id: user.id,
        movie_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path
      })
      enqueueSnackbar(`${movie.title} has been added to your watchlist`,
        { variant: 'success' })
    } catch (error) {
      enqueueSnackbar(`${movie.title} ${error.response.data}`,
        { variant: 'warning' })
    }
  }
  /*
  const handleCreateReview = () => {
    // Implement logic for creating movie review
  }
  */
  const handlePageChange = (event, value) => {
    navigate(`/trending/${value}`)
  }

  if (!movies || movies.length === 0 || (user && (!watchlist || watchlist[0] === null))) {
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
              addToWatchlist={handleAddToWatchlist}
              user={user}
            />
          </Grid>
        ))}
      </Grid>
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