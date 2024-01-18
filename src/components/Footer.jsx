import { Box, Typography } from '@mui/material'


const Footer = ({ isMobile }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mt: 'auto'
      }}
    >
      {isMobile
        ?
        <>
          <Box
            component='img'
            alt='TMDB logo'
            src='/TMDB-logo-short.svg'
            sx={{ height: 6, mr: 1 }}
          />
          <Typography variant='caption' sx={{ fontSize: 8 }}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </Typography>
        </>
        :
        <>
          <Box
            component='img'
            alt='TMDB logo'
            src='/TMDB-logo-short.svg'
            sx={{ height: 8, mr: 1 }}
          />
          <Typography variant='caption' sx={{ fontSize: 10 }}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </Typography>
        </>
      }
    </Box>
  )
}

export default Footer