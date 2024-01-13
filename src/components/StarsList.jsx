import { Typography, Grid, Container, Stack, Pagination } from '@mui/material'
import starsService from '../services/stars'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Progress from './Progress'
import StarCard from './StarCard'

const StarsList = ({ isMobile }) => {

  const starsList = useParams()
  const navigate = useNavigate()
  const [stars, setStars] = useState([])
  const [viewChanged, setViewChanged] = useState(null)
  const [totalPages, setTotalPages] = useState(null)

  useEffect(() => {
    starsService.getTrending(starsList.page)
      .then(response => {
        setStars(response.results)
        if (response.total_pages >= 20) {
          setTotalPages(20)
        } else {
          setTotalPages(response.total_pages)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }, [starsList.page, viewChanged])

  const handlePageChange = (event, value) => {
    setStars(null)
    setViewChanged(Math.random)
    navigate(`/stars/${value}`)
  }

  if (!stars || stars[0] === null || stars.length === 0) {
    return <Progress />
  }

  console.log(stars)

  return (
    <Container>
      <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 1.5, mb: 2 }}>
        Trending stars
      </Typography>
      <Grid container spacing={4} sx={{ mb: 4 }}>
        {stars.map((star) => (
          <Grid item key={star.id} xs={6} sm={4} md={3} style={{ display: 'flex' }}>
            <StarCard star={star} />
          </Grid>
        ))}
      </Grid>
      <Stack spacing={2} sx={{ alignItems: 'center', mb: 3 }}>
        <Pagination
          count={totalPages}
          page={parseInt(starsList.page)}
          onChange={handlePageChange}
          variant='outlined'
          showFirstButton
          showLastButton
          hidePrevButton={isMobile}
          hideNextButton={isMobile}
          color='primary'
        />
      </Stack>
    </Container>
  )
}

export default StarsList
