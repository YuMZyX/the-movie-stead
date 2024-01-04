import { StarOutlined } from '@mui/icons-material'
import { Avatar, Typography } from '@mui/material'

const StarIcon = ({ value }) => {

  const avatarStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 70,
    height: 70,
    backgroundColor: 'transparent',
  }
  const ratingIconStyle = {
    position: 'absolute',
    color: 'rgba(255, 215, 0, 0.8)',
    width: 70,
    height: 70,
  }
  const ratingValueStyle = {
    position: 'absolute',
    fontSize: 18
  }

  return (
    <Avatar
      style={avatarStyle}
      sx={{ alignContent: 'center' }}
    >
      <StarOutlined style={ratingIconStyle} sx={{ strokeWidth: 0.4, stroke: 'black' }} />
      <Typography
        color='black'
        fontWeight='bold'
        style={ratingValueStyle}
      >
        {value}
      </Typography>
    </Avatar>
  )
}

export default StarIcon