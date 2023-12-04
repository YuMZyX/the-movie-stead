import { Card, CardContent, CardMedia, Typography, Grid, Container } from '@mui/material'
import { format, parseISO } from 'date-fns'

const Movies = ({ movies }) => {

  return (
    <Container>
      <Typography variant='h4' gutterBottom sx={{ mt: 3, mb: 2 }}>
        Trending movies
      </Typography>
      <Grid container spacing={4} columns={20}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={10} sm={6} md={5} lg={4} style={{ display: 'flex' }}>
            <Card>
              <CardMedia
                component='img'
                alt={movie.title}
                image={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
                title={movie.title}
                style={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant='subtitle2' component='div' sx={{ fontSize: 16 }}>
                  {movie.title}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  {format(parseISO(movie.release_date), 'dd.MM.yyyy')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default Movies