import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { ConfirmProvider } from 'material-ui-confirm'
import { SnackbarProvider, closeSnackbar } from 'notistack'
import theme from './theme.js'
import { IconButton } from '@mui/material'
import { CloseOutlined } from '@mui/icons-material'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        action={(snackbarId) => (
          <IconButton
            size='small'
            aria-label='close'
            color='inherit'
            onClick={() => closeSnackbar(snackbarId)}
          >
            <CloseOutlined fontSize='small' />
          </IconButton>
        )}
      >
        <ConfirmProvider>
          <Router>
            <App />
          </Router>
        </ConfirmProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
