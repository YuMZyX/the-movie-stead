import React from 'react'
import { Grid, Card, CardMedia, Paper, Typography,
  Container, Box, Table, TableRow, TableCell, TableBody,
  Divider, IconButton, Link, Tooltip } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import moviesService from '../services/movies'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'
import Progress from './Progress'
import { Favorite, Remove, Star } from '@mui/icons-material'
import { format, parseISO } from 'date-fns'
import { uniqBy } from 'lodash'
import ReviewDialog from './ReviewDialog'

const Movie = ({ user, addToWatchlist, removeFromWatchlist }) => {

  const movieId = useParams()
  const [movie, setMovie] = useState(null)
  const [watchlist, setWatchlist] = useState([null])
  const [review, setReview] = useState()
  const [reviewProps, setReviewProps] = useState()
  const [addedOrRemoved, setAddedOrRemoved] = useState(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [edit, setEdit] = useState(false)
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

  useEffect(() => {
    if (user) {
      watchlistsService.getWatchlistMovies(user.id)
        .then(response => {
          setWatchlist(response)
        })
        .catch(error => {
          console.log(error)
        })

      reviewsService.getReview(user.id, movieId.id)
        .then(response => {
          setReview(response)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [user, addedOrRemoved])

  const calculateRuntime = (runtime) => {
    const hours = Math.floor(runtime / 60)
    const minutes = runtime % 60
    return hours + 'h ' + minutes + 'min'
  }

  const handleAddToWatchlist = async () => {
    await addToWatchlist(movie)
    setAddedOrRemoved(movie.id)
  }
  const handleRemoveFromWatchlist = async () => {
    try {
      const watchlist = await watchlistsService.getWatchlistId(user.id, movie.id)
      await removeFromWatchlist(watchlist.id, movie)
      setAddedOrRemoved(watchlist.id)
    } catch (error) {
      console.log(error)
    }
  }

  const handleCreateReview = async () => {
    setReviewProps({
      rating: null,
      review_text: null
    })
    handleOpenDialog()
  }
  const handleEditReview = async () => {
    setReviewProps({
      id: review.id,
      rating: review.rating,
      review_text: review.reviewText
    })
    setEdit(true)
    handleOpenDialog()
  }

  const handleOpenDialog = () => {
    setReviewDialogOpen(true)
  }
  const handleCloseDialog = () => {
    setReviewDialogOpen(false)
  }

  if (
    !movie
    || (user && (!watchlist || watchlist[0] === null))
    || (user && review === undefined)
  ) {
    return (
      <Progress />
    )
  }

  const movieCredits = movie.credits
  const runtime = movie.runtime > 0 ? calculateRuntime(movie.runtime) : 'N/A'
  const directors = movieCredits.crew.filter(crew => crew.job === 'Director')
  const stars = movieCredits.cast.slice(0, 4)
  const filteredWriters = movieCredits.crew
    .filter(crew => crew.job === 'Screenplay' || crew.department === 'Writing')
  const writers = uniqBy(filteredWriters, (writer) => writer.id).slice(0, 4)

  const userIconButtons = () => {
    if (watchlist.some((watchlist) => watchlist.movieId === movie.id)) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
          <Box>
            <Tooltip title='Remove from Watchlist'>
              <IconButton sx={{ boxShadow: 1, mr: 1 }} onClick={handleRemoveFromWatchlist}>
                <Favorite fontSize='medium' sx={{ color: 'red' }} />
              </IconButton>
            </Tooltip>
          </Box>
          {reviewIconButtons()}
        </Box>
      )
    } else {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
          <Box>
            <Tooltip title='Add to watchlist'>
              <IconButton sx={{ boxShadow: 1, mr: 1 }} onClick={handleAddToWatchlist}>
                <Favorite fontSize='medium' sx={{ color: 'primary.dark' }} />
              </IconButton>
            </Tooltip>
          </Box>
          {reviewIconButtons()}
        </Box>
      )
    }
  }

  const reviewIconButtons = () => {
    return (
      <Box>
        {review
          ?
          <Tooltip title='Edit review'>
            <IconButton sx={{ boxShadow: 1 }} onClick={handleEditReview}>
              <Star fontSize='medium' sx={{ color: 'gold' }} />
            </IconButton>
          </Tooltip>
          :
          <Tooltip title='Create a review'>
            <IconButton sx={{ boxShadow: 1 }} onClick={handleCreateReview}>
              <Star fontSize='medium' sx={{ color: 'primary.dark' }} />
            </IconButton>
          </Tooltip>
        }
      </Box>
    )
  }

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
            {movie.poster_path
              ?
              <CardMedia
                component="img"
                alt={movie.title}
                image={`https://image.tmdb.org/t/p/w780/${movie.poster_path}`}
                title={movie.title}
                style={{ objectFit: 'cover' }}
              />
              :
              <CardMedia
                component="img"
                alt={movie.title}
                image={'/MoviePosterNotFound.png'}
                title={movie.title}
                style={{ objectFit: 'cover' }}
              />
            }
          </Card>
        </Grid>
        <ReviewDialog
          open={reviewDialogOpen}
          handleCloseDialog={handleCloseDialog}
          user={user}
          movie={movie}
          review={reviewProps}
          edit={edit}
          setAddedOrRemoved={setAddedOrRemoved}
          setEdit={setEdit}
        />
        <Grid item xs={12} md={8}>
          <Paper elevation={7} sx={{ padding: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'top' }}>
              <Typography variant="h5"  fontWeight='bold'>
                {movie.title}
              </Typography>
              {user &&
                userIconButtons()
              }
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', mt: 0.3 }}>
              {movie.release_date
                ?
                <Typography variant='caption' fontWeight='bold' sx={{ mr: 0.5 }}>
                  {format(parseISO(movie.release_date), 'dd.MM.yyyy')}
                </Typography>
                :
                <Typography variant='caption' fontWeight='bold' sx={{ mr: 0.5 }}>
                  N/A
                </Typography>
              }
              <Remove fontSize='small'/>
              {movie.genres.length > 0
                ?
                <Typography variant='caption' fontWeight='bold' sx={{ mr: 0.5, ml: 0.5 }}>
                  {movie.genres.map((g, index) =>
                    (index ? ', ' : '') + g.name
                  ).slice(0, 3)}
                </Typography>
                :
                <Typography variant='caption' fontWeight='bold' sx={{ mr: 0.5, ml: 0.5 }}>
                  N/A
                </Typography>
              }
              <Remove fontSize='small'/>
              <Typography variant='caption' fontWeight='bold' sx={{ ml: 0.5 }}>
                {runtime}
              </Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" fontWeight='bold' sx={{ mt: 2 }} >
              <i>{movie.tagline}</i>
            </Typography>
            {movie.overview &&
              <Typography variant='subtitle2' sx={{ fontSize: 16, mt: 2 }}>
                Overview
              </Typography>
            }
            <Typography variant="body2" sx={{ mt: 0.5, mb: 1.5 }}>
              {movie.overview}
            </Typography>
            <Table size='small'>
              <TableBody>
                {directors.length > 0 &&
                  <TableRow sx={creditsStyle}>
                    <TableCell width='70' padding='none' sx={{ border: 'none' }}>
                      <Typography sx={creditTitleStyle}>
                        {directors.length > 1 ? 'Directors' : 'Director'}
                      </Typography>
                    </TableCell>
                    <TableCell padding='none' sx={{ border: 'none', display: 'flex' }}>
                      {directors.map((d, index, array) =>
                        index === array.length - 1
                          ?
                          <Typography key={d.id} sx={creditNameStyle}>{d.name}</Typography>
                          :
                          <React.Fragment key={d.id}>
                            <Typography sx={creditNameStyle}>{d.name}</Typography>
                            <Divider orientation='vertical'
                              sx={{ mr: 0.7, ml: 0.7, bgcolor: 'secondary.main' }}/>
                          </React.Fragment>
                      )}
                    </TableCell>
                  </TableRow>
                }
                {writers.length > 0 &&
                  <TableRow sx={creditsStyle}>
                    <TableCell width='70' padding='none' sx={{ border: 'none' }}>
                      <Typography sx={creditTitleStyle}>
                        {writers.length > 1 ? 'Writers' : 'Writer'}
                      </Typography>
                    </TableCell>
                    <TableCell padding='none' sx={{ border: 'none', display: 'flex' }}>
                      {writers.map((w, index, array) =>
                        index === array.length - 1
                          ?
                          <Typography key={w.id} sx={creditNameStyle}>{w.name}</Typography>
                          :
                          <React.Fragment key={w.id}>
                            <Typography sx={creditNameStyle}>{w.name}</Typography>
                            <Divider orientation='vertical'
                              sx={{ mr: 0.7, ml: 0.7, bgcolor: 'secondary.main' }}/>
                          </React.Fragment>
                      )}
                    </TableCell>
                  </TableRow>
                }
                {stars.length > 0 &&
                  <TableRow sx={creditsStyle}>
                    <TableCell width='70' padding='none' sx={{ border: 'none' }}>
                      <Typography sx={creditTitleStyle}>
                        {stars.length > 1 ? 'Stars' : 'Star'}
                      </Typography>
                    </TableCell>
                    <TableCell padding='none' sx={{ border: 'none', display: 'flex' }}>
                      {stars.map((s, index, array) =>
                        index === array.length - 1
                          ?
                          <Typography key={s.id} sx={creditNameStyle}>{s.name}</Typography>
                          :
                          <React.Fragment key={s.id}>
                            <Typography sx={creditNameStyle}>{s.name}</Typography>
                            <Divider orientation='vertical'
                              sx={{ mr: 0.7, ml: 0.7, bgcolor: 'secondary.main' }}/>
                          </React.Fragment>
                      )}
                    </TableCell>
                  </TableRow>
                }
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