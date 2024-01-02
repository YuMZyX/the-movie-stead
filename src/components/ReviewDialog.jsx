import { Dialog, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import ReviewForm from './ReviewForm'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}))

const ReviewDialog = ({ open, handleCloseDialog, user, movie, setAddedOrRemoved }) => {

  return (
    <BootstrapDialog open={open} onClose={handleCloseDialog} fullWidth>
      <IconButton
        onClick={handleCloseDialog}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: 'primary.dark'
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <ReviewForm
          user={user}
          movie={movie}
          handleCloseDialog={handleCloseDialog}
          setAddedOrRemoved={setAddedOrRemoved}
        />
      </DialogContent>
    </BootstrapDialog>
  )
}

export default ReviewDialog