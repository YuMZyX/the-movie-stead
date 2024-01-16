import { AppBar, Toolbar, IconButton, Button, Menu, MenuItem,
  Container, Tooltip, Box, ListItemIcon, Divider, Avatar,
  Popper, MenuList, Paper } from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { useState } from 'react'
import { Login, Logout, HowToReg, MenuOutlined, VideocamOutlined,
  StarOutlined, FavoriteOutlined, PersonOutlined, TrendingUpOutlined,
  FaceRetouchingNaturalOutlined, ArrowDropDownOutlined,
  SavedSearchOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { usePopupState, bindHover, bindPopper } from 'material-ui-popup-state/hooks'

const Navbar = ({ handleLogout, user, isMobile, isTablet }) => {

  const [accountAnchorEl, setAccountAnchorEl] = useState(null)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const accountOpen = Boolean(accountAnchorEl)
  const menuOpen = Boolean(menuAnchorEl)
  const navigate = useNavigate()
  const moviesPopperState = usePopupState({
    variant: 'popper',
    popupId: 'movies-popper'
  })

  const handleAccountMenu = (event) => {
    setAccountAnchorEl(event.currentTarget)
  }
  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null)
  }

  const handleAppMenu = (event) => {
    setMenuAnchorEl(event.currentTarget)
  }
  const handleAppMenuClose = () => {
    setMenuAnchorEl(null)
  }

  const iconsStyles = {
    color: 'primary.dark',
    mr: 2
  }

  const navbarLinks = (user) => {
    if (!user) {
      return (
        <Box sx={{ display: 'flex' }}>
          {moviesMenu()}
          <Button color='inherit' onClick={() => navigate('/stars/trending/1')}>Stars</Button>
        </Box>
      )
    } else {
      return (
        <Box>
          {isMobile || isTablet
            ?
            <Box>
              <IconButton
                color='inherit'
                aria-controls={menuOpen ? 'app-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={menuOpen ? 'true' : undefined}
                onClick={handleAppMenu}
              >
                <MenuOutlined />
              </IconButton>
              <Menu
                id='app-menu'
                anchorEl={menuAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={menuOpen}
                onClose={handleAppMenuClose}
              >
                <MenuItem id='movies' onClick={() => {
                  handleAppMenuClose()
                  navigate('/trending/1')
                }}>
                  <ListItemIcon>
                    <VideocamOutlined sx={iconsStyles} />
                  </ListItemIcon>
                  Trending movies
                </MenuItem>
                <MenuItem id='discover' onClick={() => {
                  handleAppMenuClose()
                  navigate('/discover/1')
                }}>
                  <ListItemIcon>
                    <SavedSearchOutlined sx={iconsStyles} />
                  </ListItemIcon>
                  Discover movies
                </MenuItem>
                <MenuItem id='stars' onClick={() => {
                  handleAppMenuClose()
                  navigate('/stars/trending/1')
                }}>
                  <ListItemIcon>
                    <FaceRetouchingNaturalOutlined sx={iconsStyles} />
                  </ListItemIcon>
                  Stars
                </MenuItem>
                <MenuItem id='my-reviews' onClick={() => {
                  handleAppMenuClose()
                  navigate(`/myreviews/${user.id}`)
                }}>
                  <ListItemIcon>
                    <StarOutlined sx={iconsStyles} />
                  </ListItemIcon>
                  My Reviews
                </MenuItem>
                <MenuItem id='watchlist' onClick={() => {
                  handleAppMenuClose()
                  navigate(`/watchlist/${user.id}`)
                }}>
                  <ListItemIcon>
                    <FavoriteOutlined sx={iconsStyles} />
                  </ListItemIcon>
                  Watchlist
                </MenuItem>
                {(user.role === 'moderator' || user.role === 'admin') &&
                  <MenuItem id='users' onClick={() => {
                    handleAppMenuClose()
                    navigate('/users')
                  }}>
                    <ListItemIcon>
                      <PersonOutlined sx={iconsStyles} />
                    </ListItemIcon>
                    Users
                  </MenuItem>
                }
              </Menu>
            </Box>
            :
            <Box sx={{ display: 'flex' }}>
              {moviesMenu()}
              <Button id='stars' color='inherit' onClick={() => navigate('/stars/trending/1')}>
                Stars
              </Button>
              <Button id='my-reviews' color='inherit' onClick={() => navigate(`/myreviews/${user.id}`)}>
                My Reviews
              </Button>
              <Button id='watchlist' color='inherit' onClick={() => navigate(`/watchlist/${user.id}`)}>
                Watchlist
              </Button>
              {(user.role === 'moderator' || user.role === 'admin') &&
                <Button id='users' color='inherit' onClick={() => navigate('/users')}>
                  Users
                </Button>
              }
            </Box>
          }
        </Box>
      )
    }
  }

  const moviesMenu = () => {
    return (
      <div>
        <Button
          {...bindHover(moviesPopperState)}
          id='movies'
          color='inherit'
          onClick={() => navigate('/trending/1')}
          endIcon={<ArrowDropDownOutlined />}
          sx={{ '& .MuiButton-endIcon': { marginLeft: '0px' } }}
        >
          Movies
        </Button>
        <Popper
          {...bindPopper(moviesPopperState)}
          placement='bottom-start'
          disablePortal
        >
          <Paper>
            <MenuList id='movies-menu'>
              <MenuItem id='movies' onClick={() => {navigate('/trending/1')}}>
                <ListItemIcon>
                  <TrendingUpOutlined sx={iconsStyles} />
                </ListItemIcon>
                Trending movies
              </MenuItem>
              <MenuItem id='discover' onClick={() => {navigate('/discover/1')}}>
                <ListItemIcon>
                  <SavedSearchOutlined sx={iconsStyles} />
                </ListItemIcon>
                Discover movies
              </MenuItem>
            </MenuList>
          </Paper>
        </Popper>
      </div>
    )
  }

  return (
    <AppBar position='sticky' sx={{ backgroundColor: 'primary.main', borderRadius: 4 }}>
      <Container>
        <Toolbar disableGutters sx={{ color: 'secondary.main' }}>
          {isMobile
            ?
            <Box
              component='img'
              alt='The Movie Stead - Logo'
              src='/the-movie-stead-logo-mobile.png'
              sx={{
                height: 40,
                width: 130,
                cursor: 'pointer'
              }}
              onClick={() => navigate('/trending/1')}
            />
            :
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
          }
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
                  aria-controls={accountOpen ? 'account-menu' : undefined}
                  aria-haspopup='true'
                  aria-expanded={accountOpen ? 'true' : undefined}
                  onClick={handleAccountMenu}
                  sx={{ ml: 1 }}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>
              <Menu
                id='account-menu'
                anchorEl={accountAnchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={accountOpen}
                onClose={handleAccountMenuClose}
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
                    <MenuItem id='my-account' onClick={() => {
                      handleAccountMenuClose()
                      navigate(`/users/${user.id}`)
                    }}>
                      <ListItemIcon>
                        <AccountCircle sx={iconsStyles} />
                      </ListItemIcon>
                      My account
                    </MenuItem>
                    <MenuItem id='logout' onClick={() => {
                      handleLogout()
                      handleAccountMenuClose()
                    }}>
                      <ListItemIcon>
                        <Logout sx={iconsStyles} />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </div>
                  :
                  <div>
                    <MenuItem id='account-menu-login' onClick={() => {
                      navigate('/login')
                      handleAccountMenuClose()
                    }}>
                      <ListItemIcon>
                        <Login sx={iconsStyles} />
                      </ListItemIcon>
                      Login
                    </MenuItem>
                    <MenuItem id='account-menu-signup' onClick={() => {
                      navigate('/signup')
                      handleAccountMenuClose()
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
