import { Typography, Grid, Container, Stack, Pagination,
  TextField, InputAdornment } from '@mui/material'
import starsService from '../../services/stars'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Progress from '../../components/Progress'
import StarCard from './components/StarCard'
import { SearchRounded } from '@mui/icons-material'
import { debounce } from 'lodash'

const StarsList = ({ isMobile }) => {

  const starsList = useParams()
  const navigate = useNavigate()
  const [stars, setStars] = useState([])
  const [viewChanged, setViewChanged] = useState(null)
  const [totalPages, setTotalPages] = useState(null)
  const [totalResults, setTotalResults] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const q = searchParams.get('q')
    if (!q) {
      starsService.getTrending(starsList.page)
        .then(response => {
          setStars(response.results)
          if (response.total_pages >= 20) {
            setTotalPages(20)
          } else {
            setTotalPages(response.total_pages)
          }
          setTotalResults(null)
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      starsService.searchStars({ search: q }, starsList.page)
        .then(response => {
          setStars(response.results)
          if (response.total_pages >= 20) {
            setTotalPages(20)
          } else {
            setTotalPages(response.total_pages)
          }
          setTotalResults(response.total_results)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [starsList.page, viewChanged, searchParams])

  const handlePageChange = (event, value) => {
    setStars(null)
    setViewChanged(Math.random)
    navigate(`/stars/trending/${value}?${searchParams.toString()}`)
  }

  const debouncedhandleSearch = useCallback(
    debounce((event) => {
      setSearchParams({ q: event.target.value })
    }, 1000, [])
  )

  if (!stars || stars[0] === null || !totalPages) {
    return <Progress />
  }

  if (stars.length === 0 && totalResults > 0) {
    setStars(null)
    navigate(`/stars/trending/1?${searchParams.toString()}`)
  }

  return (
    <Container>
      <TextField
        id='star-search'
        fullWidth
        sx={{ mt: 2 }}
        label='Search for a star'
        onChange={debouncedhandleSearch}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <SearchRounded />
            </InputAdornment>
          )
        }}
      />
      {totalResults === null
        ?
        <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ mt: 1.5, mb: 2 }}>
          Trending stars
        </Typography>
        :
        <Typography variant='h6' fontWeight='bold' gutterBottom sx={{ mt: 1.5, mb: 2 }}>
          {totalResults} Stars matched your search
        </Typography>
      }
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
