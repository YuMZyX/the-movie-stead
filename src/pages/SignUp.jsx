import { Avatar, Button, TextField, Grid, Box,
  Typography, Container } from '@mui/material'
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined'
import { Link } from 'react-router-dom'
import Copyright from '../components/Copyright'
import userService from '../services/users'
import sessionService from '../services/sessions'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const validationSchema = yup.object({
  name: yup
    .string('Name')
    .required('Name is required')
    .min(4, 'Name has to be atleast 4 characters long')
    .max(50, 'Name cannot be over 50 characters long'),
  email: yup
    .string('Email address')
    .email('Enter a valid email')
    .required('Email address is required'),
  password: yup
    .string('Password')
    .required('Password is required')
    .min(6, 'Password has to be atleast 6 characters long')
    .max(50, 'Password cannot be over 50 characters long'),
  passwordCheck: yup
    .string('Confirm password')
    .required('Password confirmation is required')
    .oneOf([yup.ref('password'), null], 'Your passwords do not match')
})

const SignUp = ({ setUser }) => {

  const [error, setError] = useState('')
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      passwordCheck: ''
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const { name, email, password } = values
      try {
        const newUser = await userService.signUp({ name, email, password, role: 'user' })
        if (newUser.id) {
          const user = await sessionService.login({ email, password })
          window.localStorage.setItem('loggedTMSUser', JSON.stringify(user))
          setUser(user)
        }
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '90vh',
        }}
      >
        <Avatar sx={{ m: 2, bgcolor: 'primary.main', color: 'secondary.main' }}>
          <HowToRegOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          The Movie Stead - Sign up
        </Typography>
        <Box component='form' noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            autoComplete='name'
            required
            fullWidth
            id='name'
            label='Name'
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            autoFocus
            sx={{ mt: 2 }}/>
          <TextField
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
            sx={{ mt: 3 }}/>
          <TextField
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
            helperText={formik.touched.password && formik.errors.password}
            sx={{ mt: 3 }}/>
          <TextField
            required
            fullWidth
            name='passwordCheck'
            label='Confirm password'
            type='password'
            id='passwordCheck'
            value={formik.values.passwordCheck}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.passwordCheck && Boolean(formik.errors.passwordCheck)}
            helperText={formik.touched.passwordCheck && formik.errors.passwordCheck}
            sx={{ mt: 3 }}/>
          {error && <Typography variant='caption' color='error' sx={{ ml: 2 }}>{error}</Typography>}
          <Button
            id='signup-button'
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 4, mb: 2, color: 'secondary.main' }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent='flex-start'>
            <Grid item>
              <Link to='/login' variant='body2'>
                <Typography>Already have an account? Sign in</Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Copyright />
      </Box>
    </Container>
  )
}

export default SignUp