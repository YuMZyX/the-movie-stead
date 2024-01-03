import React from 'react'
import { Card, Box, CardMedia, IconButton, Menu, CardContent,
  Typography, MenuItem, ListItemIcon, Avatar, CardActions, Collapse } from '@mui/material'
import { FavoriteOutlined, MoreVertOutlined,
  StarOutlined, ExpandMoreOutlined } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import watchlistsService from '../services/watchlists'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props
  expand ? expand : expand
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}))

const ReviewCard = ({ movie, watchlist, review, addToWatchlist,
  removeFromWatchlist, editReview, user }) => {

  const [expanded, setExpanded] = useState(false)
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
  const handleExpandClick = () => {
    setExpanded(!expanded)
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

  const handleEditReview = (review) => {
    editReview(movie, review)
    handleMenuClose()
  }

  const userMenuItems = (movie) => {
    if (watchlist.some((watchlist) => watchlist.movieId === movie.id)) {
      return (
        <Box>
          <MenuItem onClick={handleRemoveFromWatchlist}>
            <ListItemIcon>
              <FavoriteOutlined sx={{ color: 'red' }} />
            </ListItemIcon>
            Remove from Watchlist
          </MenuItem>
          <MenuItem onClick={() => handleEditReview(review)}>
            <ListItemIcon>
              <StarOutlined sx={{ color: 'gold' }} />
            </ListItemIcon>
            Edit review
          </MenuItem>
        </Box>
      )
    } else {
      return (
        <Box>
          <MenuItem onClick={handleAddToWatchlist}>
            <ListItemIcon>
              <FavoriteOutlined sx={{ color: 'primary.dark' }} />
            </ListItemIcon>
            Add to Watchlist
          </MenuItem>
          <MenuItem onClick={() => handleEditReview(review)}>
            <ListItemIcon>
              <StarOutlined sx={{ color: 'gold' }} />
            </ListItemIcon>
            Edit review
          </MenuItem>
        </Box>
      )
    }
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
  const ratingStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
  }

  return (
    <Card raised sx={{ borderRadius: 2.5, display: 'flex', flexDirection: 'column' }} key={review.id}>
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
        <Avatar style={ratingStyle} variant='rounded'
          sx={{ m: 0.7, width: 50, height: 40, backgroundColor: 'rgba(245, 232, 199, 0.6)', color: 'black' }}>
          <Typography variant='body1' fontWeight='bold'>{review.rating}/10</Typography>
        </Avatar>
      </Box>
      <CardContent>
        <Link to={`/movies/${movie.id}`} style={linkStyle}>
          <Typography variant='body1' fontWeight='bold' component='div'
            sx={{ fontSize: 16, '&:hover': { color: 'secondary.dark' } }}>
            {movie.title}
          </Typography>
        </Link>
      </CardContent>
      {review.reviewText &&
      <React.Fragment>
        <CardActions sx={{ mt: 'auto' }}>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='Show more'
          >
            <ExpandMoreOutlined />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <CardContent>
            <Typography>{review.reviewText}</Typography>
          </CardContent>
        </Collapse>
      </React.Fragment>
      }
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
        {user &&
          userMenuItems(movie)
        }
      </Menu>
    </Card>
  )
}

export default ReviewCard