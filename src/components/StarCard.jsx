import { Card, CardMedia, CardContent, Typography } from '@mui/material'
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
          image={'no-photo-available.jpg'}
          title={star.name}
          sx={{ cursor: 'pointer', borderBottom: 1 }}
          style={posterStyle}
          onClick={() => handleCardClick(star.id)}
        />
      }
      <CardContent>
        <Link to={`/stars/${star.id}`} style={linkStyle}>
          <Typography variant='body1' fontWeight='bold' component='div'
            sx={{ fontSize: 16, '&:hover': { color: 'secondary.dark' }, mb: 1 }}>
            {star.name}
          </Typography>
        </Link>
        <Typography variant='body2'>
          {star.known_for.map((movie) => (
            <li key={movie.id} style={{ marginLeft: 10 }}>
              {movie.title || movie.name}
            </li>
          ))}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default StarCard