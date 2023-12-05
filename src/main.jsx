import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { ThemeProvider } from '@mui/material'
import { ConfirmProvider } from 'material-ui-confirm'
import theme from './theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ConfirmProvider>
        <Router>
          <App />
        </Router>
      </ConfirmProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
