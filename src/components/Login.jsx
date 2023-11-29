import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Link
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const Login = () => {

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '90vh',
      }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Login
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
              <Link href='#' variant='body2'>
                Don&apos;t have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default Login