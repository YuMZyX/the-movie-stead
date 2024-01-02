import { FavoriteOutlined, MoreVertOutlined,
  StarOutlined } from '@mui/icons-material'
import { Card, CardContent, CardMedia, Typography, IconButton,
  Menu, MenuItem, Box, ListItemIcon, } from '@mui/material'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import watchlistsService from '../services/watchlists'

const MovieCard = ({ movie, watchlist, reviews, addToWatchlist,
  removeFromWatchlist, createReview, user }) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleCardClick = (id) => {
    navigate(`/movies/${id}`)
  }

  const handleAddToWatchlist = () => {
    addToWatchlist(movie)
    handleMenuClose()
  }
  const handleRemoveFromWatchlist = async () => {
    try {
      const watchlist = await watchlistsService.getWatchlistId(user.id, movie.id)
      removeFromWatchlist(watchlist.id, movie)
    } catch (error) {
      console.log(error)
    }
    handleMenuClose()
  }

  const handleCreateReview = () => {
    createReview(movie)
    handleMenuClose()
  }

  const userMenuItems = (movie) => {
    if (watchlist.some((watchlist) => watchlist.movieId === movie.id)) {
      return (
        <div>
          <MenuItem onClick={handleRemoveFromWatchlist}>
            <ListItemIcon>
              <FavoriteOutlined sx={{ color: 'red' }} />
            </ListItemIcon>
            Remove from Watchlist
          </MenuItem>
          {reviewMenuItems(movie)}
        </div>
      )
    } else {
      return (
        <div>
          <MenuItem onClick={handleAddToWatchlist}>
            <ListItemIcon>
              <FavoriteOutlined sx={{ color: 'primary.dark' }} />
            </ListItemIcon>
            Add to Watchlist
          </MenuItem>
          {reviewMenuItems(movie)}
        </div>
      )
    }
  }

  const reviewMenuItems = (movie) => {
    return (
      <div>
        {reviews.some((review) => review.movieId === movie.id)
          ?
          <MenuItem>
            <ListItemIcon>
              <StarOutlined sx={{ color: 'gold' }} />
            </ListItemIcon>
            Edit review
          </MenuItem>
          :
          <MenuItem onClick={handleCreateReview}>
            <ListItemIcon>
              <StarOutlined sx={{ color: 'primary.dark' }} />
            </ListItemIcon>
            Create a review
          </MenuItem>
        }
      </div>
    )
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

  return (
    <Card raised sx={{ borderRadius: 2.5 }} key={movie.id}>
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
          userMenuItems(movie)
          :
          <MenuItem style={{
            backgroundColor: 'transparent',
            cursor: 'default'
          }}>
            Log in to add movies to watchlist and to create movie reviews.
          </MenuItem>
        }
      </Menu>
    </Card>
  )
}

export default MovieCard