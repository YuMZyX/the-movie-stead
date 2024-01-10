import { StarOutlined } from '@mui/icons-material'
import { IconButton, Tooltip, Typography } from '@mui/material'

const StarIcon = ({ value, review, editReview, avg }) => {

  const handleEditClick = () => {
    if (!avg) {
      editReview(review)
    }
  }

  const avatarStyle = avg
    ? {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 70,
      height: 70,
    }
    : {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 70,
      height: 70,
    }
  const ratingIconStyle = avg
    ? {
      position: 'absolute',
      color: 'rgba(137, 196, 244, 0.8)',
      width: 70,
      height: 70,
    }
    : {
      position: 'absolute',
      color: 'rgba(255, 215, 0, 0.8)',
      width: 70,
      height: 70,
    }
  const ratingValueStyle = avg
    ? {
      position: 'absolute',
      fontSize: 16
    }
    : {
      position: 'absolute',
      fontSize: 18
    }
  const iconButtonStyle = avg
    ? {
      alignContent: 'center',
      cursor: 'auto'
    }
    : {
      alignContent: 'center',
      '&:hover': { backgroundColor: 'rgba(245, 232, 199, 0.4)' }
    }

  const toolTip = avg ? 'Rating average' : 'Edit review'

  return (
    <Tooltip title={toolTip}>
      <IconButton
        style={avatarStyle}
        sx={iconButtonStyle}
        onClick={handleEditClick}
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