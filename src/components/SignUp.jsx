import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Link } from 'react-router-dom'

const SignUp = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
    window.alert('To be implemented...')
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '95vh',
        }}
      >
        <Avatar sx={{ m: 2, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          The Movie Stead - Sign up
        </Typography>
        <Box component='form' noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            autoComplete='name'
            required
            fullWidth
            id='fullname'
            label='Name'
            autoFocus
            sx={{ mt: 2 }}/>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email address'
            name='email'
            autoComplete='email'
            autoFocus
            sx={{ mt: 3 }}/>
          <TextField
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            sx={{ mt: 2 }}/>
          <TextField
            required
            fullWidth
            name='password-confirm'
            label='Confirm password'
            type='password'
            id='password-confirm'
            sx={{ mt: 3 }}/>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 4, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent='flex-start'>
            <Grid item>
              <Link to='/login' variant='body2'>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Typography
          variant='body2'
          color='text.secondary'
          align='center'
          sx={{ mt: 6, mb: 4 }}
        >
          © YuMZyX {new Date().getFullYear()}
        </Typography>
      </Box>
    </Container>
  )
}

export default SignUp