import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'

const Copyright = () => {
  return (
    <Typography
      variant='body2'
      color='text.secondary'
      align='center'
      sx={{ mt: 5, mb: 4 }}
    >
      <Link color='inherit' href='https://github.com/YuMZyX' target='_blank'>
        © YuMZyX {new Date().getFullYear()}
      </Link>
    </Typography>
  )
}

export default Copyright