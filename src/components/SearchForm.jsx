import { Button, TextField, IconButton, Box, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { SearchOutlined } from '@mui/icons-material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'

const validationSchema = yup.object({
  search: yup
    .string('Search for a movie')
    .required('Search string is required'),
  year: yup
    .date()
    .nullable(true)
})

const SearchForm = ({ setMovies, setAddedOrRemoved, isMobile }) => {

  const navigate = useNavigate()

  const displayDirection = isMobile ? 'column' : 'row'
  const searchMargin = isMobile ? 0 : 2

  const formik = useFormik({
    initialValues: {
      search: '',
      year: null
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (setMovies && setAddedOrRemoved) {
        setMovies([null])
        setAddedOrRemoved(Math.random)
      }
      const { search, year } = values
      if (year) {
        const yearParam = year.getFullYear()
        navigate(`/moviesearch/1?q=${search}&y=${yearParam}`)
      } else {
        navigate(`/moviesearch/1?q=${search}`)
      }
    }
  })

  const linkStyle = {
    textDecoration: 'none',
    color: 'black',
    display: 'inline-block'
  }

  return (
    <Box>
      <Box
        component='form'
        onSubmit={formik.handleSubmit}
        noValidate
        sx={{ display: 'flex', flexDirection: displayDirection }}
      >
        <Box sx={{ flexGrow: 1, mt: 2, mr: searchMargin }}>
          <TextField
            id='search'
            name='search'
            fullWidth
            required
            label='Search for a movie'
            value={formik.values.search}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.search && Boolean(formik.errors.search)}
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
            views={['year']}
            value={formik.values.year}
            label='Release year'
            maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
            sx={{ minWidth: 170 }}
            onChange={(value) => formik.setFieldValue('year', value, true)}
            slotProps={{
              textField: {
                variant: 'outlined',
                error: formik.touched.year && Boolean(formik.errors.year),
              }
            }}
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
      <Link to='/discover/1' style={linkStyle}>
        <Typography
          variant='subtitle2'
          sx={{ mt: 0.5, ml: 1, '&:hover': { color: 'secondary.dark' }, fontSize: 16 }}
        >
          Advanced search &gt;
        </Typography>
      </Link>
    </Box>
  )
}

export default SearchForm