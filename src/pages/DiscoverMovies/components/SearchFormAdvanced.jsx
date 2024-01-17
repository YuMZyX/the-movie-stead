import { TextField, Box, FormControl, InputLabel, Select,
  MenuItem, Grid, OutlinedInput, Chip, IconButton } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import FilterSort from '../../../components/FilterSort'
import { useEffect, useState } from 'react'
import moviesService from '../../../services/movies'
import Progress from '../../../components/Progress'
import { ClearOutlined } from '@mui/icons-material'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from 'use-debounce'

const sortItems = [
  { value: 'popularity.desc', selectText: 'Popularity, descending' },
  { value: 'popularity.asc', selectText: 'Popularity, ascending' },
  { value: 'original_title.asc', selectText: 'Movie title, (A-Z)' },
  { value: 'original_title.desc', selectText: 'Movie title, (Z-A)' },
  { value: 'primary_release_date.desc', selectText: 'Release date, descending' },
  { value: 'primary_release_date.asc', selectText: 'Release date, ascending' },
  { value: 'vote_average.desc', selectText: 'TMDB rating, descending' },
  { value: 'vote_average.asc', selectText: 'TMDB rating, ascending' },
]

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6 + ITEM_PADDING_TOP,
    },
  },
}

const SearchFormAdvanced = ({ movieFilter, setMovieFilter, isMobile }) => {

  const [genres, setGenres] = useState([null])
  const [genre, setGenre] = useState([])
  const [sortOption, setSortOption] = useState('')
  const [runtimeMin, setRuntimeMin] = useState('')
  const [runtimeMin_ud] = useDebounce(runtimeMin, 1000)
  const [runtimeMax, setRuntimeMax] = useState('')
  const [runtimeMax_ud] = useDebounce(runtimeMax, 1000)
  const [releaseDateMin, setReleaseDateMin] = useState(null)
  const [releaseDateMax, setReleaseDateMax] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const [paramsChanged, setParamsChanged] = useState(false)

  useEffect(() => {
    moviesService.getGenres()
      .then(response => {
        setGenres(response.genres)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    if (
      sortOption !== ''
      || genre[0] !== null || genre === null
      || runtimeMin !== ''
      || runtimeMax !== ''
      || releaseDateMin !== null
      || releaseDateMax !== null
    ) {
      setParamsChanged(searchParams)
    }
  })

  useEffect(() => {
    if (paramsChanged) {
      setSearchParams({
        sort_by: sortOption,
        with_genres: genre.join('|'),
        with_runtime_gte: runtimeMin_ud,
        with_runtime_lte: runtimeMax_ud,
        release_date_gte: releaseDateMin
          ? `${releaseDateMin.getFullYear()}-${('0' + (releaseDateMin.getMonth() + 1))
            .slice(-2)}-${('0' + releaseDateMin.getDate()).slice(-2)}`
          : releaseDateMin,
        release_date_lte: releaseDateMax
          ? `${releaseDateMax.getFullYear()}-${('0' + (releaseDateMax.getMonth() + 1))
            .slice(-2)}-${('0' + releaseDateMax.getDate()).slice(-2)}`
          : releaseDateMax,
      })
    }
  }, [genre, sortOption, runtimeMin_ud, runtimeMax_ud, releaseDateMin, releaseDateMax])

  const handleSortChange = (event) => {
    setSortOption(event.target.value)
  }

  const handleFilterChange = (event) => {
    setMovieFilter(event.target.value)
  }

  const handleGenreChange = (event) => {
    const {
      target: { value },
    } = event
    setGenre(
      typeof value === 'string' ? value.split(',') : value,
    )
  }
  const clearGenres = () => {
    setGenre([])
  }

  const handleRuntimeMin = (event) => {
    setRuntimeMin(event.target.value)
  }
  const handleRuntimeMax = (event) => {
    setRuntimeMax(event.target.value)
  }

  if (!genres || genres[0] === null) {
    return (
      <Progress />
    )
  }

  return (
    <Box sx={{ mb: 2 }}>
      <FilterSort
        filter={movieFilter}
        sortOption={sortOption}
        handleFilterChange={handleFilterChange}
        handleSortChange={handleSortChange}
        sortItems={sortItems}
        label='Filter page results by'
        isMobile={isMobile}
      />
      <Grid container columnSpacing={4} rowSpacing={2}>
        <Grid
          item
          sx={{ display: 'flex', flexDirection: 'column', minWidth: 220 }}
          xs={12} sm={6} md={4}
        >
          <DatePicker
            label='Release date starting'
            name='release_date_min'
            value={releaseDateMin}
            onChange={(newValue) => setReleaseDateMin(newValue)}
            slotProps={{
              textField: {
                id: 'release-date-min'
              }
            }}
          />
          <DatePicker
            label='Release date ending'
            name='release_date_max'
            value={releaseDateMax}
            onChange={(newValue) => setReleaseDateMax(newValue)}
            sx={{ mt: 1 }}
            slotProps={{
              textField: {
                id: 'release-date-max'
              }
            }}
          />
        </Grid>
        <Grid
          item
          sx={{ display: 'flex', flexDirection: 'column', minWidth: 220 }}
          xs={12} sm={6} md={4}
        >
          <TextField
            label='Runtime from (minutes)'
            value={runtimeMin}
            onChange={handleRuntimeMin}
            name='runtime_min'
            id='runtime_min'
            type='number'
            fullWidth
          />
          <TextField
            label='Runtime to (minutes)'
            value={runtimeMax}
            onChange={handleRuntimeMax}
            name='runtime_max'
            id='runtime_max'
            type='number'
            fullWidth
            sx={{ mt: 1 }}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Select genres</InputLabel>
            <Select
              value={genre}
              id='genres'
              multiple
              onChange={handleGenreChange}
              label='Select genres'
              fullWidth
              input={<OutlinedInput id='select-genres' label='Select genres'/>}
              MenuProps={MenuProps}
              sx={{ '& .MuiSelect-iconOutlined': { display: genre.length > 0 ? 'none' : '' } }}
              endAdornment={
                <IconButton
                  sx={{ visibility: genre.length > 0 ? 'visible' : 'hidden' }}
                  onClick={clearGenres}
                >
                  <ClearOutlined />
                </IconButton>
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={genres.find(genre => genre.id === value).name}
                      color='primary'
                    />
                  ))}
                </Box>
              )}
            >
              {genres.map((genre) => (
                <MenuItem id={genre.name} key={genre.id} value={genre.id}>
                  {genre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SearchFormAdvanced