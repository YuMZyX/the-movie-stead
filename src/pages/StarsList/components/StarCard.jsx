import { Card, CardMedia, CardContent, Typography, List, ListItem } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'


const StarCard = ({ star }) => {

  const navigate = useNavigate()

  const handleCardClick = (id) => {
    navigate(`/stars/${id}`)
  }

  const posterStyle = {
    objectFit: 'cover',
    aspectRatio: '0.67/1'
  }
  const linkStyle = {
    color: 'black',
    textDecoration: 'none',
    display: 'inline-block'
  }

  return (
    <Card raised sx={{ borderRadius: 2.5 }} key={star.id}>
      {star.profile_path
        ?
        <CardMedia
          component='img'
          alt={star.name}
          image={`https://image.tmdb.org/t/p/w500/${star.profile_path}`}
          title={star.name}
          sx={{ cursor: 'pointer', borderBottom: 1 }}
          style={posterStyle}
          onClick={() => handleCardClick(star.id)}
        />
        :
        <CardMedia
          component='img'
          alt={star.name}
          image={'/photo-not-available.png'}
          title={star.name}
          sx={{ cursor: 'pointer', borderBottom: 1 }}
          style={posterStyle}
          onClick={() => handleCardClick(star.id)}
        />
      }
      <CardContent sx={{ '&:last-child': { pb: 1.5 } }}>
        <Link to={`/stars/${star.id}`} style={linkStyle}>
          <Typography variant='body1' fontWeight='bold' component='div'
            sx={{ fontSize: 16, '&:hover': { color: 'secondary.dark' } }}>
            {star.name}
          </Typography>
        </Link>
        <List sx={{ listStyleType: 'disc', pl: 2 }}>
          {star.known_for?.map((movie) => (
            <ListItem
              disablePadding
              key={movie.id}
              sx={{ display: 'list-item', mt: 0.3 }}
            >
              <Typography variant='body2' sx={{ ml: 0.3 }}>
                {movie.title || movie.name}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

export default StarCard