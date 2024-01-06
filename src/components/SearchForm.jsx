import { Button, TextField, IconButton, Box } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { SearchOutlined } from '@mui/icons-material'

const SearchForm = ({ movieSearch, year, handleMovieSearch,
  handleSearchChange, handleYearChange, isMobile }) => {

  const displayDirection = isMobile ? 'column' : 'row'
  const searchMargin = isMobile ? 0 : 2

  return (
    <Box
      component='form'
      onSubmit={handleMovieSearch}
      sx={{ display: 'flex', flexDirection: displayDirection }}
    >
      <Box sx={{ flexGrow: 1, mt: 2, mr: searchMargin }}>
        <TextField
          fullWidth
          required
          label='Search for a movie'
          value={movieSearch}
          onChange={handleSearchChange}
          InputProps={{
            endAdornment: (
              <IconButton type='submit'>
                <SearchOutlined />
              </IconButton>
            )
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', mt: 2 }}>
        <DatePicker
          label='Release year'
          views={['year']}
          value={year}
          maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
          sx={{ minWidth: 170 }}
          onChange={handleYearChange}
        />
        <Button
          variant='contained'
          fullWidth
          sx={{ ml: 2, color: 'secondary.main', whiteSpace: 'nowrap' }}
          type='submit'
        >
          Search
        </Button>
      </Box>
    </Box>
  )
}

export default SearchForm