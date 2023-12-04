import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Container, Tooltip, Box, ListItemIcon, Divider, Avatar } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useState } from 'react'
import { Login, Logout, HowToReg } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'

const Navbar = ({ handleLogout, user }) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position='sticky' sx={{ backgroundColor: '#435585', borderRadius: 4 }}>
      <Container>
        <Toolbar disableGutters sx={{ color: '#F5E8C7' }}>

          <Box
            component='img'
            alt='The Movie Stead - Logo'
            src='/the-movie-stead-logo.png'
            sx={{
              height: 40,
              width: 300
            }}
          />

          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'flex-end'
          }}>
            <Box>
              <Button color='inherit' onClick={() => navigate('/')}>Movies</Button>
            </Box>

            {user &&
            <Box>
              <Button color='inherit'>My Reviews</Button>
              <Button color='inherit'>Watchlist</Button>
            </Box>
            }

            <Box>
              <Tooltip title='Account settings'>
                <IconButton
                  size='small'
                  color='inherit'
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleMenu}
                  sx={{ ml: 2 }}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                id='account-menu'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                {user
                  ?
                  <div>
                    <MenuItem style={{
                      backgroundColor: 'transparent',
                      cursor: 'default'
                    }}>
                      <Avatar sx={{
                        width: 30,
                        height: 30,
                        mr: 2,
                        backgroundColor: 'primary.main',
                        color: 'secondary.main'
                      }}/>
                      {user.name}
                    </MenuItem>
                    <Divider />
                    <MenuItem>
                      <ListItemIcon>
                        <AccountCircle />
                      </ListItemIcon>
                      My account
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleLogout()
                      handleClose()
                    }}>
                      <ListItemIcon>
                        <Logout />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </div>
                  :
                  <div>
                    <MenuItem onClick={() => {
                      navigate('/login')
                      handleClose()
                    }}>
                      <ListItemIcon>
                        <Login />
                      </ListItemIcon>
                      Login
                    </MenuItem>
                    <MenuItem onClick={() => {
                      navigate('/signup')
                      handleClose()
                    }}>
                      <ListItemIcon>
                        <HowToReg />
                      </ListItemIcon>
                      Sign Up
                    </MenuItem>
                  </div>
                }
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default Navbar
