import { Box, Container, Typography } from '@mui/material'

const NotFound = () => {
  return (
    <Container>
      <Box sx={{ mt: 2, ml: 2 }}>
        <Typography variant='h6'>
          Page not found, please check your url.
        </Typography>
      </Box>
    </Container>
  )
}

export default NotFound