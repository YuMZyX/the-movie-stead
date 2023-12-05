import { Container, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import userService from '../services/users'
import Progress from './Progress'
import Redirect from './Redirect'

const User = ({ user }) => {
  const userId = useParams()
  const [userPage, setUserPage] = useState(null)

  useEffect(() => {
    userService.getOne(userId.id)
      .then(response => {
        setUserPage(response)
      })
  },[])

  if (!userPage || userPage.length === 0 || !user) {
    return (
      <Progress />
    )
  }
  if (!(user.email === userPage.email || user.role === 'moderator')) {
    return (
      <Redirect />
    )
  }

  return (
    <Container>
      <Typography>{userPage.name}</Typography>
      <Typography>{userPage.email}</Typography>
    </Container>
  )
}

export default User