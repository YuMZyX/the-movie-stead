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

const ReviewDialog = ({ open, handleCloseDialog, user, movie,
  review, edit, setAddedOrRemoved, setEdit }) => {

  const handleClose = () => {
    handleCloseDialog()
    setEdit(false)
  }

  return (
    <BootstrapDialog open={open} onClose={handleClose} fullWidth>
      <IconButton
        onClick={handleClose}
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
          review={review}
          edit={edit}
          handleCloseDialog={handleClose}
          setAddedOrRemoved={setAddedOrRemoved}
        />
      </DialogContent>
    </BootstrapDialog>
  )
}

export default ReviewDialog