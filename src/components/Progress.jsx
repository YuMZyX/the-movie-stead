import { Box, CircularProgress, Typography } from '@mui/material'
const Progress = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center',
      alignItems: 'center', minHeight: '90vh', flexDirection: 'column' }}>
      <CircularProgress color='primary' />
      <Typography variant='caption' sx={{ mt: 1 }}>Loading...</Typography>
    </Box>
  )
}

export default Progress