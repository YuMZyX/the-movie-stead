import { useNavigate } from 'react-router-dom'
import { Dialog, DialogActions, DialogTitle, DialogContent,
  DialogContentText, Button } from '@mui/material'
import { useState } from 'react'

const Redirect = () => {
  const [open, setOpen] = useState(true)
  const navigate = useNavigate()

  const handleClose = () => {
    setOpen(false)
    navigate('/')
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>Access denied!</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          Redirecting to frontpage.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default Redirect