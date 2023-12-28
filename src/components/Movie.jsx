import { Grid, Card, CardMedia, Paper, Typography,
  Container, Box, Table, TableRow, TableCell, TableBody,
  Divider, IconButton, Link, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moviesService from '../services/movies'
import Progress from './Progress'
import { Favorite, Remove, Star } from '@mui/icons-material'
import { format, parseISO } from 'date-fns'
import { uniqBy } from 'lodash'
import watchlistsService from '../services/watchlists'

const Movie = ({ user }) => {

  const movieId = useParams()
  const [movie, setMovie] = useState(null)
  const imdbBaseUrl = 'https://www.imdb.com/title/'

  useEffect(() => {
    moviesService.getMovie(movieId.id)
      .then(response => {
        setMovie(response)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const calculateRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    return hours + 'h ' + minutes + 'min'
  }

  const addToWatchlist = async (movie) => {
    const movieToAdd = await watchlistsService.addToWatchlist({
      user_id: user.id,
      movie_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path
    })
    console.log(movieToAdd)
  }

  if (!movie) {
    return (
      <Progress />
    )
  }

  const movieCredits = movie.credits
  const runtime = calculateRuntime(movie.runtime)
  const directors = movieCredits.crew.filter(crew => crew.job === 'Director')
  const stars = movieCredits.cast.slice(0, 4)
  const filteredWriters = movieCredits.crew
    .filter(crew => crew.job === 'Screenplay' || crew.department === 'Writing')
  const writers = uniqBy(filteredWriters, (writer) => writer.id).slice(0, 4)

  const creditsStyle = {
    display: 'flex',
    flexDirection: 'row',
    mt: 1.5,
  }
  const creditTitleStyle = {
    fontSize: 14,
    fontWeight: 'bold'
  }
  const creditNameStyle = {
    fontSize: 14
  }

  return (
    <Container>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} md={4}>
          <Card raised sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              alt={movie.title}
              image={`https://image.tmdb.org/t/p/w780/${movie.poster_path}`}
              title={movie.title}
              style={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={7} sx={{ padding: 2.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'top' }}>
              <Typography variant="h5"  fontWeight='bold'>
                {movie.title}
              </Typography>
              {user &&
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
                <Tooltip title='Add to watchlist'>
                  <IconButton sx={{ boxShadow: 1, mr: 1 }} onClick={() => addToWatchlist(movie)}>
                    <Favorite fontSize='medium' sx={{ color: 'red' }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Create a review'>
                  <IconButton sx={{ boxShadow: 1 }}>
                    <Star fontSize='medium' sx={{ color: 'gold' }} />
                  </IconButton>
                </Tooltip>
              </Box>
              }
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant='caption' fontWeight='bold' sx={{ mr: 0.5 }}>
                {format(parseISO(movie.release_date), 'dd.MM.yyyy')}
              </Typography>
              <Remove fontSize='small'/>
              <Typography variant='caption' fontWeight='bold' sx={{ mr: 0.5, ml: 0.5 }}>
                {movie.genres.map((g, index) =>
                  (index ? ', ' : '') + g.name
                ).slice(0, 3)}
              </Typography>
              <Remove fontSize='small'/>
              <Typography variant='caption' fontWeight='bold' sx={{ ml: 0.5 }}>
                {runtime}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" fontWeight='bold' sx={{ mt: 2 }} >
              <i>{movie.tagline}</i>
            </Typography>
            <Typography variant='subtitle2' sx={{ fontSize: 16, mt: 2 }}>
              Overview
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, mb: 1.5 }}>
              {movie.overview}
            </Typography>
            <Table size='small'>
              <TableBody>
                <TableRow sx={creditsStyle}>
                  <TableCell width='70' padding='none' sx={{ border: 'none' }}>
                    <Typography sx={creditTitleStyle}>
                      {directors.length > 1 ? 'Directors' : 'Director'}
                    </Typography>
                  </TableCell>
                  <TableCell padding='none' sx={{ border: 'none', display: 'flex' }}>
                    {directors.map((d, index, array) =>
                      index === array.length - 1
                        ? <Typography key={d.id} sx={creditNameStyle}>{d.name}</Typography>
                        : <><Typography key={d.id} sx={creditNameStyle}>{d.name}</Typography>
                          <Divider orientation='vertical'
                            sx={{ mr: 0.7, ml: 0.7, bgcolor: 'secondary.main' }}/></>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow sx={creditsStyle}>
                  <TableCell width='70' padding='none' sx={{ border: 'none' }}>
                    <Typography sx={creditTitleStyle}>
                      {writers.length > 1 ? 'Writers' : 'Writer'}
                    </Typography>
                  </TableCell>
                  <TableCell padding='none' sx={{ border: 'none', display: 'flex' }}>
                    {writers.map((w, index, array) =>
                      index === array.length - 1
                        ? <Typography key={w.id} sx={creditNameStyle}>{w.name}</Typography>
                        : <><Typography key={w.id} sx={creditNameStyle}>{w.name}</Typography>
                          <Divider orientation='vertical'
                            sx={{ mr: 0.7, ml: 0.7, bgcolor: 'secondary.main' }}/></>
                    )}
                  </TableCell>
                </TableRow>
                <TableRow sx={creditsStyle}>
                  <TableCell width='70' padding='none' sx={{ border: 'none' }}>
                    <Typography sx={creditTitleStyle}>
                      {stars.length > 1 ? 'Stars' : 'Star'}
                    </Typography>
                  </TableCell>
                  <TableCell padding='none' sx={{ border: 'none', display: 'flex' }}>
                    {stars.map((s, index, array) =>
                      index === array.length - 1
                        ? <Typography key={s.id} sx={creditNameStyle}>{s.name}</Typography>
                        : <><Typography key={s.id} sx={creditNameStyle}>{s.name}</Typography>
                          <Divider orientation='vertical'
                            sx={{ mr: 0.7, ml: 0.7, bgcolor: 'secondary.main' }}/></>
                    )}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Link target='_blank' href={`${imdbBaseUrl}${movie.imdb_id}/`}>
              <Box
                component='img'
                alt='IMDb logo'
                src={'/IMDb_Logo_Rectangle_Gold.png'}
                sx={{
                  width: 80,
                  mt: 3
                }}
              />
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Movie