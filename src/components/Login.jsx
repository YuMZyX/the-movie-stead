import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
} from '@mui/material'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import { Link, useNavigate } from 'react-router-dom'
import Copyright from './Copyright'

const Login = () => {

  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/')
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <Avatar sx={{ m: 2, bgcolor: 'success.main' }}>
          <LoginOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          The Movie Stead - Login
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email address'
            name='email'
            autoComplete='email'
            autoFocus />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password' />
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to='/signup' variant='body2'>
                Don&apos;t have an account? Sign Up
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