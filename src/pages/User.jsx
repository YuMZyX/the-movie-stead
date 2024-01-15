import { Avatar, Box, Container, Paper, Table, TableBody,
  TableCell, TableRow, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import userService from '../services/users'
import Progress from '../components/Progress'
import Redirect from '../components/Redirect'
import { ManageAccountsOutlined, PersonAddAltOutlined,
  PersonOutlineOutlined } from '@mui/icons-material'
import { format, parseISO } from 'date-fns'
import watchlistsService from '../services/watchlists'
import reviewsService from '../services/reviews'

const User = ({ user }) => {
  const userId = useParams()
  const [userPage, setUserPage] = useState(null)
  const [watchlist, setWatchlist] = useState([null])
  const [reviews, setReviews] = useState([null])

  useEffect(() => {
    userService.getUser(userId.id)
      .then(response => {
        setUserPage(response)
      })
  }, [userId])

  useEffect(() => {
    if (userPage) {
      watchlistsService.getWatchlistMovies(userPage.id)
        .then(response => {
          setWatchlist(response)
        })
        .catch(error => {
          console.log(error)
        })
      reviewsService.getUserReviews(userPage.id)
        .then(response => {
          setReviews(response)
        })
        .catch (error => {
          console.log(error)
        })
    }
  }, [userPage])

  const userAvatar = () => {
    if (userPage.role === 'admin') {
      return (
        <ManageAccountsOutlined sx={iconStyle} />
      )
    } else if (userPage.role === 'moderator') {
      return (
        <PersonAddAltOutlined sx={iconStyle} />
      )
    } else {
      return (
        <PersonOutlineOutlined sx={iconStyle} />
      )
    }
  }

  const iconStyle = {
    width: 45,
    height: 45
  }
  const tableRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    mt: 1.3,
    ml: 1
  }
  const tableRowReviewsStyle = {
    display: 'flex',
    flexDirection: 'row',
    mt: 4,
    ml: 1
  }
  const tableCellStyle = {
    border: 'none',
    display: 'flex',
  }
  const titleStyle = {
    fontSize: 14,
    fontWeight: 'bold'
  }
  const valueStyle = {
    fontSize: 14,
  }
  const reviewTitleStyle = {
    fontSize: 16,
    fontWeight: 'bold'
  }
  const reviewValueStyle = {
    fontSize: 16,
  }

  if (
    !userPage
    || userPage.length === 0
    || !user
    || watchlist[0] === null
    || reviews[0] === null
    || watchlist.count === null
    || reviews.count === null
  ) {
    return (
      <Progress />
    )
  }
  if (
    !(user.email === userPage.email
    || user.role === 'moderator'
    || user.role === 'admin')) {
    return (
      <Redirect />
    )
  }

  return (
    <Container>
      <Paper elevation={7} sx={{ padding: 2.5, mt: 2 }}>
        <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'center' }}>
          <Avatar
            sx={{
              mr: 2,
              width: 65,
              height: 65,
              backgroundColor: 'primary.main',
              color: 'secondary.main' }}
          >
            {userAvatar()}
          </Avatar>
          <Typography variant="h5"  fontWeight='bold'>
            {userPage.name}
          </Typography>
        </Box>
        <Table size='small'>
          <TableBody>
            <TableRow sx={tableRowStyle}>
              <TableCell width='70' padding='none' sx={tableCellStyle}>
                <Typography sx={titleStyle}>
                  Email
                </Typography>
              </TableCell>
              <TableCell padding='none' sx={tableCellStyle}>
                <Typography sx={valueStyle}>
                  {userPage.email}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowStyle}>
              <TableCell width='70' padding='none' sx={tableCellStyle}>
                <Typography sx={titleStyle}>
                  Joined
                </Typography>
              </TableCell>
              <TableCell padding='none' sx={tableCellStyle}>
                <Typography sx={valueStyle}>
                  {format(parseISO(userPage.createdAt), 'dd.MM.yyyy')}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowStyle}>
              <TableCell width='70' padding='none' sx={tableCellStyle}>
                <Typography sx={titleStyle}>
                  Role
                </Typography>
              </TableCell>
              <TableCell padding='none' sx={tableCellStyle}>
                <Typography sx={valueStyle}>
                  {userPage.role}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow sx={tableRowReviewsStyle}>
              <TableCell width='130' padding='none' sx={tableCellStyle}>
                <Typography sx={reviewTitleStyle}>
                  Movie reviews
                </Typography>
              </TableCell>
              <TableCell padding='none' sx={tableCellStyle}>
                <Link to={`/myreviews/${userPage.id}`} >
                  <Typography sx={reviewValueStyle}>
                    {reviews.count} reviews
                  </Typography>
                </Link>
              </TableCell>
            </TableRow>
            {(user.email === userPage.email) &&
              <TableRow sx={tableRowStyle}>
                <TableCell width='130' padding='none' sx={tableCellStyle}>
                  <Typography sx={reviewTitleStyle}>
                    In Watchlist
                  </Typography>
                </TableCell>
                <TableCell padding='none' sx={tableCellStyle}>
                  <Link to={`/watchlist/${user.id}`} >
                    <Typography sx={reviewValueStyle}>
                      {watchlist.count} movies
                    </Typography>
                  </Link>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}

export default User