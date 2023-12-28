import { FavoriteOutlined, MoreVertOutlined,
  StarOutlined } from '@mui/icons-material'
import { Card, CardContent, CardMedia, Typography, Grid, Container, Stack,
  IconButton, Menu, MenuItem, Box, ListItemIcon, Pagination } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import moviesService from '../services/movies'
import Progress from './Progress'
//import watchlistsService from '../services/watchlists'

const MoviesList = ({ user }) => {

  const moviesList = useParams()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const [movies, setMovies] = useState([])
  const [totalPages, setTotalPages] = useState(null)

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

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleAddToWatchlist = (movie) => {
    console.log(movie)
    handleMenuClose()
  }
  const handleCreateReview = () => {
    // Implement logic for creating movie review
    handleMenuClose()
  }
  const handleCardClick = (id) => {
    navigate(`/movies/${id}`)
  }
  const handlePageChange = (event, value) => {
    navigate(`/trending/${value}`)
  }

  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
  }
  const iconStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
  }

  if (!movies || movies.length === 0) {
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
            <Card raised sx={{ borderRadius: 2.5 }}>
              <Box component='div' sx={{ position: 'relative' }}>
                <CardMedia
                  component='img'
                  alt={movie.title}
                  image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  title={movie.title}
                  sx={{ objectFit: 'contain', cursor: 'pointer', borderBottom: 1 }}
                  onClick={() => handleCardClick(movie.id)}
                />
                <IconButton style={iconStyle} onClick={handleMenuClick} size='small'
                  sx={{
                    backgroundColor: 'rgba(245, 232, 199, 0.4)',
                    m: 0.7,
                    color: 'black',
                    '&:hover': { backgroundColor: 'secondary.main' }
                  }}>
                  <MoreVertOutlined fontSize='small' />
                </IconButton>
              </Box>
              <CardContent>
                <Link to={`/movies/${movie.id}`} style={linkStyle}>
                  <Typography variant='body1' fontWeight='bold' component='div'
                    sx={{ fontSize: 16, '&:hover': { color: 'secondary.dark' } }}>
                    {movie.title}
                  </Typography>
                </Link>
              </CardContent>
              <Menu
                id='movie-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {user
                  ?
                  <div>
                    <MenuItem key={movie.id} onClick={() => handleAddToWatchlist(movie.title)}>
                      <ListItemIcon>
                        <FavoriteOutlined />
                      </ListItemIcon>
                      Add to Watchlist
                    </MenuItem>
                    <MenuItem onClick={handleCreateReview}>
                      <ListItemIcon>
                        <StarOutlined />
                      </ListItemIcon>
                      Create a review
                    </MenuItem>
                  </div>
                  :
                  <MenuItem style={{
                    backgroundColor: 'transparent',
                    cursor: 'default'
                  }}>
                    Log in to add movies to watchlist or to create movie reviews.
                  </MenuItem>
                }
              </Menu>
            </Card>
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