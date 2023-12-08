import { MoreVertOutlined } from '@mui/icons-material'
import { Card, CardContent, CardMedia, Typography,
  Grid, Container, CardActionArea, IconButton, Menu, MenuItem } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const Movies = ({ movies }) => {

  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleAddToWatchlist = () => {
    // Implement logic for adding movie to watchlist
    handleMenuClose()
  }
  const handleCardClick = (id) => {
    navigate(`/movies/${id}`)
  }

  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
  }
  const iconStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    color: 'white'
  }

  return (
    <Container>
      <Typography variant='h4' gutterBottom sx={{ mt: 3, mb: 2 }}>
        Trending movies
      </Typography>
      <Grid container spacing={4} columns={20}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={10} sm={6} md={5} lg={4} style={{ display: 'flex' }}>
            <Card>
              <CardActionArea>
                <CardMedia
                  component='img'
                  alt={movie.title}
                  image={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
                  title={movie.title}
                  style={{ objectFit: 'cover' }}
                  onClick={() => handleCardClick(movie.id)}
                />
                <IconButton style={iconStyle} onClick={handleMenuClick}>
                  <MoreVertOutlined />
                </IconButton>
              </CardActionArea>
              <CardContent>
                <Link to={`/movies/${movie.id}`} style={linkStyle}>
                  <Typography variant='body1' fontWeight='bold' component='div'
                    sx={{ fontSize: 16, '&:hover': { color: 'secondary.dark' } }}>
                    {movie.title}
                  </Typography>
                </Link>
                <Typography variant='body2' color='textSecondary'>
                  {format(parseISO(movie.release_date), 'dd.MM.yyyy')}
                </Typography>
              </CardContent>

              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleAddToWatchlist}>Add to Watchlist</MenuItem>
              </Menu>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Movies