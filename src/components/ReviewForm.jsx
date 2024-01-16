import { Button, TextField, Box, Typography, Container,
  Rating, Card, CardMedia } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useState } from 'react'
import reviewsService from '../services/reviews'
import { useSnackbar } from 'notistack'
import { useConfirm } from 'material-ui-confirm'

const validationSchema = yup.object({
  rating: yup
    .number()
    .required('Rating is required'),
  review_text: yup
    .string('Write your review here')
    .max(1000, 'Review cannot exceed 1000 characters in length')
})

const ReviewForm = ({ user, movie, review, edit, handleCloseDialog, setAddedOrRemoved }) => {

  const [error, setError] = useState('')
  const { enqueueSnackbar } = useSnackbar()
  const confirm = useConfirm()

  const formik = useFormik({
    initialValues: {
      rating: review.rating,
      review_text: review.review_text ? review.review_text : ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { rating, review_text } = values
      try {
        const newReview = await reviewsService.createReview({
          user_id: user.id,
          movie_id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path || 'NO_POSTER',
          rating: rating,
          review_text: review_text || null
        })
        handleCloseDialog()
        enqueueSnackbar(`You reviewed ${movie.title}`,
          { variant: 'success' })
        setAddedOrRemoved(newReview.id)
      } catch (error) {
        console.log(error)
        setError(error.response.data)
        setTimeout(() => {
          setError('')
        }, 5000)
      }
    }
  })

  const handleEdit = async (values) => {
    const { rating, review_text } = values
    try {
      await reviewsService.editReview(review.id, {
        rating: rating,
        review_text: review_text
      })
      handleCloseDialog()
      enqueueSnackbar(`Edited review for ${movie.title}`,
        { variant: 'info' })
      setAddedOrRemoved(Math.random())
    } catch (error) {
      console.log(error)
      setError(error.response.data)
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }

  const handleRemove = async () => {
    confirm({
      title: 'Delete review?',
      description: movie.title,
      confirmationText: 'Delete', dialogProps: {
        id: 'delete-confirm',
        PaperProps: {
          sx: {
            width: 'auto',
            minWidth: '13%'
          }
        }
      } })
      .then(async () => {
        try {
          await reviewsService.deleteReview(review.id)
          handleCloseDialog()
          enqueueSnackbar(`Deleted review for ${movie.title}`,
            { variant: 'info' })
          setAddedOrRemoved(review.movieId)
        } catch (error) {
          console.log(error)
          setError(error.response.data)
          setTimeout(() => {
            setError('')
          }, 5000)
        }
      })
      .catch(() => {})
  }

  return (
    <Container>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Typography variant='h6' fontWeight='bold'>
          {movie.title}
        </Typography>
        <Card raised sx={{ mt: 2, mb: 2 }}>
          {(!movie.poster_path || movie.poster_path === 'NO_POSTER')
            ?
            <CardMedia
              component='img'
              alt={movie.title}
              image={'/MoviePosterNotFound.png'}
              title={movie.title}
              height='280'
            />
            :
            <CardMedia
              component='img'
              alt={movie.title}
              image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              title={movie.title}
              height='280'
            />
          }
        </Card>
        <Box component='form' onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant='body2' fontWeight='bold' sx={{ mr: 1 }}>
              Your rating:
            </Typography>
            <Rating
              max={10}
              name='rating'
              id='rating'
              value={parseInt(formik.values.rating)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Box>
          <TextField
            margin='normal'
            fullWidth
            name='review_text'
            label='Write your review'
            id='review_text'
            multiline
            value={formik.values.review_text}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={(formik.touched.review_text && Boolean(formik.errors.review_text))}
            helperText={(formik.touched.review_text && formik.errors.review_text)}
            inputProps={{ style: { resize: 'vertical' } }}
          />
          {error && <Typography color='error' sx={{ ml: 1, fontSize: 12 }}>{error}</Typography>}
          {formik.touched.rating && formik.errors.rating &&
            <Typography color='error' sx={{ ml:1, fontSize: 12 }}>
              {formik.touched.rating && formik.errors.rating}
            </Typography>
          }
          {edit
            ?
            <Box>
              <Button id='edit-review' fullWidth variant='contained' onClick={() => handleEdit(formik.values)}
                sx={{ mt: 2, mb: 1, color: 'secondary.main' }}>
                Edit review
              </Button>
              <Button id='delete-review' fullWidth variant='contained' onClick={handleRemove}
                color='error' sx={{ mt: 1, mb: 1, color: 'secondary.main' }}>
                Delete review
              </Button>
            </Box>
            :
            <Button id='create-review' type='submit' fullWidth variant='contained'
              sx={{ mt: 2, mb: 2, color: 'secondary.main' }}>
              Create review
            </Button>
          }
        </Box>
      </Box>
    </Container>
  )
}

export default ReviewForm