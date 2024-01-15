import { Avatar, Button, TextField, Grid, Box,
  Typography, Container } from '@mui/material'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import { Link, useNavigate } from 'react-router-dom'
import Copyright from '../components/Copyright'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useState } from 'react'
import sessionService from '../services/sessions'

const validationSchema = yup.object({
  email: yup
    .string('Email address')
    .email('Enter a valid email')
    .required('Email address is required'),
  password: yup
    .string('Password')
    .required('Password is required')
})

const Login = ({ setUser }) => {

  const navigate = useNavigate()
  const [error, setError] = useState('')

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { email, password } = values
      try {
        const user = await sessionService.login({ email, password })
        window.localStorage.setItem('loggedTMSUser', JSON.stringify(user))
        setUser(user)
        navigate('/trending/1')
      } catch (error) {
        setError(error.response.data)
        setTimeout(() => {
          setError('')
        }, 5000)
      }
    }
  })

  return (
    <Container component='main' maxWidth='xs'>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '90vh',
      }}>
        <Avatar sx={{ m: 2, bgcolor: 'primary.main', color: 'secondary.main' }}>
          <LoginOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          The Movie Stead - Login
        </Typography>
        <Box component='form' onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email address'
            name='email'
            autoComplete='email'
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            autoFocus />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password} />
          {error && <Typography variant='caption' color='error' sx={{ ml: 2 }}>{error}</Typography>}
          <Button
            id='login-button'
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2, color: 'secondary.main' }}>
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to='/signup' variant='body2'>
                <Typography>Don&apos;t have an account? Sign Up</Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright />
      </Box>
    </Container>
  )
}

export default Login