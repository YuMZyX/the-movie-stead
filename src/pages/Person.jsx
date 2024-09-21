import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink } from 'react-router-dom'
import starsService from '../services/stars'
import Progress from '../components/Progress'
import { format, parseISO } from 'date-fns'
import moment from 'moment'
import { Container, Grid, CardMedia, Card, Paper, Typography,
  Table, TableBody, TableRow, TableCell, Link, Box, CardContent, CardActionArea } from '@mui/material'
import { uniqBy } from 'lodash'

const Person = ({ isMobile, isTablet }) => {

  const personId = useParams()
  const [star, setStar] = useState(null)
  const imdbBaseUrl = 'https://www.imdb.com/name/'

  useEffect(() => {
    starsService.getStar(personId.id)
      .then(response => {
        setStar(response)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const parseGender = (genderNumber) => {
    switch (genderNumber) {
    case (0):
      return 'Not specified'
    case (1):
      return 'Female'
    case (2):
      return 'Male'
    case (3):
      return 'Non-binary'
    default:
      return 'Not specified'
    }
  }

  const calculateAge = (dob) => {
    const age = moment().diff(moment(dob, 'YYYY-MM-DD'), 'years')
    return `(${age} years old)`
  }
  const calculateAgeAtDeath = (dob, dod) => {
    const born = moment(dob, 'YYYY-MM-DD')
    const died = moment(dod, 'YYYY-MM-DD')
    const age = died.diff(born, 'years')
    return `(${age} years old)`
  }

  const knownForCast = () => {
    if (isMobile) {
      return uniqBy(star.movie_credits.cast, (movie) => movie.id).sort((a, b) =>
        (b.vote_count * b.vote_average) - (a.vote_count * a.vote_average)).slice(0, 3)
    } else if (isTablet) {
      return uniqBy(star.movie_credits.cast, (movie) => movie.id).sort((a, b) =>
        (b.vote_count * b.vote_average) - (a.vote_count * a.vote_average)).slice(0, 4)
    } else {
      return uniqBy(star.movie_credits.cast, (movie) => movie.id).sort((a, b) =>
        (b.vote_count * b.vote_average) - (a.vote_count * a.vote_average)).slice(0, 5)
    }
  }
  const knownForCrew = () => {
    if (isMobile) {
      return uniqBy(star.movie_credits.crew, (movie) => movie.id).sort((a, b) =>
        (b.vote_count * b.vote_average) - (a.vote_count * a.vote_average)).slice(0, 3)
    } else if (isTablet) {
      return uniqBy(star.movie_credits.crew, (movie) => movie.id).sort((a, b) =>
        (b.vote_count * b.vote_average) - (a.vote_count * a.vote_average)).slice(0, 4)
    } else {
      return uniqBy(star.movie_credits.crew, (movie) => movie.id).sort((a, b) =>
        (b.vote_count * b.vote_average) - (a.vote_count * a.vote_average)).slice(0, 5)
    }
  }

  const calculateDob = () => {
    if (star.deathday) {
      return format(parseISO(star.birthday), 'dd.MM.yyyy')
    } else if (star.birthday) {
      return format(parseISO(star.birthday), 'dd.MM.yyyy')
        + ' ' + calculateAge(star.birthday)
    } else {
      return null
    }
  }

  const posterStyle = {
    objectFit: 'cover',
    aspectRatio: '0.67/1'
  }
  const tableRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    mt: 1,
  }
  const tableCellStyle = {
    border: 'none',
    display: 'flex',
  }
  const tableCellBornStyle = {
    border: 'none',
    display: 'flex',
    flexDirection: 'column'
  }
  const titleStyle = {
    fontSize: 14,
    fontWeight: 'bold'
  }
  const valueStyle = {
    fontSize: 14,
  }

  if (!star) return <Progress />

  const gender = parseGender(star.gender)
  const born = calculateDob()
  const died = star.deathday
    ? format(parseISO(star.deathday), 'dd.MM.yyyy') + ' ' +
      calculateAgeAtDeath(star.birthday, star.deathday)
    : null
  const knownFor = star.known_for_department === 'Acting'
    ? knownForCast()
    : knownForCrew()

  return (
    <Container>
      <Grid container spacing={2} sx={{ mt: 0, mb: 3 }}>
        <Grid item xs={12} sm={6} md={3.9}>
          <Card raised>
            {star.profile_path
              ?
              <CardMedia
                component='img'
                alt={star.name}
                image={`https://image.tmdb.org/t/p/w780/${star.profile_path}`}
                title={star.name}
                style={posterStyle}
              />
              :
              <CardMedia
                component='img'
                alt={star.name}
                image={'/photo-not-available.png'}
                title={star.name}
                style={posterStyle}
              />
            }
          </Card>
        </Grid>
        <Grid item xs={12} sm={12} md={8.1}>
          <Paper elevation={7} sx={{ padding: 2.5 }}>
            <Typography variant="h5"  fontWeight='bold' sx={{ mb: 1.5 }}>
              {star.name}
            </Typography>
            <Table size='small'>
              <TableBody>
                <TableRow sx={tableRowStyle}>
                  <TableCell width='75' padding='none' sx={tableCellStyle}>
                    <Typography sx={titleStyle}>
                      Priority
                    </Typography>
                  </TableCell>
                  <TableCell padding='none' sx={tableCellStyle}>
                    <Typography sx={valueStyle}>
                      {star.known_for_department}
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={tableRowStyle}>
                  <TableCell width='75' padding='none' sx={tableCellStyle}>
                    <Typography sx={titleStyle}>
                      Gender
                    </Typography>
                  </TableCell>
                  <TableCell padding='none' sx={tableCellStyle}>
                    <Typography sx={valueStyle}>
                      {gender}
                    </Typography>
                  </TableCell>
                </TableRow>
                {born &&
                <TableRow sx={tableRowStyle}>
                  <TableCell width='75' padding='none' sx={tableCellStyle}>
                    <Typography sx={titleStyle}>
                      Born
                    </Typography>
                  </TableCell>
                  <TableCell padding='none' sx={tableCellBornStyle}>
                    <Typography sx={valueStyle}>
                      {born}
                    </Typography>
                    <Typography sx={valueStyle}>
                      {star.place_of_birth}
                    </Typography>
                  </TableCell>
                </TableRow>
                }
                {died &&
                <TableRow sx={tableRowStyle}>
                  <TableCell width='75' padding='none' sx={tableCellStyle}>
                    <Typography sx={titleStyle}>
                      Died
                    </Typography>
                  </TableCell>
                  <TableCell padding='none' sx={tableCellStyle}>
                    <Typography sx={valueStyle}>
                      {died}
                    </Typography>
                  </TableCell>
                </TableRow>
                }
              </TableBody>
            </Table>
            {knownFor.length > 0 &&
              <Typography variant='subtitle2' sx={{ fontSize: 16, mt: 3 }}>
                Known for
              </Typography>
            }
            <Grid container spacing={1.5} sx={{ mt: 0 }}>
              {knownFor.map((movie) => (
                <Grid item key={movie.id}
                  xs={4} sm={3} md={2.4}
                  sx={{ display: 'flex' }}
                >
                  <Card raised>
                    <CardActionArea component={RouterLink} to={`/movies/${movie.id}`}>
                      {movie.poster_path
                        ?
                        <CardMedia
                          component='img'
                          alt={movie.title}
                          image={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
                          title={movie.title}
                          sx={{ borderBottom: 0.5 }}
                          style={posterStyle}
                        />
                        :
                        <CardMedia
                          component='img'
                          alt={movie.title}
                          image={'/no-movie-poster.png'}
                          title={movie.title}
                          sx={{ borderBottom: 0.5 }}
                          style={posterStyle}
                        />
                      }
                      <CardContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        p: 1,
                        '&:last-child': { pb: 1 }
                      }}>
                        <Typography variant='caption' fontWeight='bold'>
                          {movie.title}
                        </Typography>
                        <Typography variant='caption' sx={{ mt: 0.5 }}>
                          {movie.character}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
            {star.biography &&
              <Box sx={{ whiteSpace: 'pre-wrap' }}>
                <Typography variant='subtitle2' sx={{ fontSize: 16, mt: 3 }}>
                  Biography
                </Typography>
                <Typography variant="body2"sx={{ mt: 0.5, mb: 1.5 }}>
                  {star.biography.toString()}
                </Typography>
              </Box>
            }
            {star.imdb_id &&
              <Link target='_blank' href={`${imdbBaseUrl}${star.imdb_id}/`}>
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
            }
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Person