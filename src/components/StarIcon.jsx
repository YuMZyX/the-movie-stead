import { StarOutlined } from '@mui/icons-material'
import { IconButton, Tooltip, Typography } from '@mui/material'

const StarIcon = ({ value, review, editReview }) => {

  const avatarStyle = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 70,
    height: 70,
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
    <Tooltip title='Edit review'>
      <IconButton
        style={avatarStyle}
        sx={{
          alignContent: 'center',
          '&:hover': { backgroundColor: 'rgba(245, 232, 199, 0.4)' }
        }}
        onClick={() => editReview(review)}
      >
        <StarOutlined style={ratingIconStyle} sx={{ strokeWidth: 0.4, stroke: 'black' }} />
        <Typography
          color='black'
          fontWeight='bold'
          style={ratingValueStyle}
        >
          {value}
        </Typography>
      </IconButton>
    </Tooltip>
  )
}

export default StarIcon