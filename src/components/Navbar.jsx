import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem, Container,
  Tooltip, Box, ListItemIcon, Divider, Avatar } from '@mui/material'
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

  const iconsStyles = {
    color: 'primary.dark'
  }

  const navbarLinks = (user) => {
    if (!user) {
      return (
        <Box>
          <Button color='inherit' onClick={() => navigate('/trending/1')}>Movies</Button>
        </Box>
      )
    } else {
      return (
        <Box>
          <Button color='inherit' onClick={() => navigate('/trending/1')}>Movies</Button>
          <Button color='inherit' onClick={() => navigate(`/myreviews/${user.id}`)}>My Reviews</Button>
          <Button color='inherit' onClick={() => navigate(`/watchlist/${user.id}`)}>Watchlist</Button>
          {user.role === 'moderator' &&
            <Button color='inherit' onClick={() => navigate('/users')}>Users</Button>
          }
        </Box>
      )
    }
  }

  return (
    <AppBar position='sticky' sx={{ backgroundColor: 'primary.main', borderRadius: 4 }}>
      <Container>
        <Toolbar disableGutters sx={{ color: 'secondary.main' }}>
          <Box
            component='img'
            alt='The Movie Stead - Logo'
            src='/the-movie-stead-logo.png'
            sx={{
              height: 40,
              width: 300,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/trending/1')}
          />
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexGrow: 1,
            justifyContent: 'flex-end'
          }}>
            {navbarLinks(user)}
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
                    <MenuItem onClick={() => {
                      handleClose()
                      navigate(`/users/${user.id}`)
                    }}>
                      <ListItemIcon>
                        <AccountCircle sx={iconsStyles} />
                      </ListItemIcon>
                      My account
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleLogout()
                      handleClose()
                    }}>
                      <ListItemIcon>
                        <Logout sx={iconsStyles} />
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
                        <Login sx={iconsStyles} />
                      </ListItemIcon>
                      Login
                    </MenuItem>
                    <MenuItem onClick={() => {
                      navigate('/signup')
                      handleClose()
                    }}>
                      <ListItemIcon>
                        <HowToReg sx={iconsStyles} />
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
