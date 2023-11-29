import { Card, CardContent, CardMedia, Typography, Grid, Container } from '@mui/material'

const Movies = ({ movies }) => {
  return (
    <Container>
      <Typography variant='h3' gutterBottom>
        Trending movies
      </Typography>
      <Grid container spacing={5} alignItems='stretch'>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3} style={{ display: 'flex' }}>
            <Card>
              <CardMedia
                component='img'
                alt={movie.title}
                image={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
                title={movie.title}
                style={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant='h6' component='div'>
                  {movie.title}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Release Date: {movie.release_date}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  Popularity: {movie.popularity}
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