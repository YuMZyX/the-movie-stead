import { Box, TextField, Select, MenuItem, FormControl,
  InputLabel, InputAdornment } from '@mui/material'
import { SearchRounded } from '@mui/icons-material'

const FilterSort = ({ filter, sortOption, handleFilterChange,
  handleSortChange, sortItems, label, isMobile }) => {

  const flexDirection = isMobile ? 'column' : 'row'
  const marginTop = isMobile ? 2 : 0

  return (
    <Box sx={{ display: 'flex', flexDirection: flexDirection, mb: 2, mt: 2 }}>
      <TextField
        id='filter-results'
        sx={{ mr: 2 }}
        label={label}
        fullWidth
        value={filter}
        onChange={handleFilterChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <SearchRounded />
            </InputAdornment>
          )
        }}
        InputLabelProps={{
          shrink: true
        }}
      />
      <FormControl sx={{ minWidth: 240, mt: marginTop }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          id='sort-results'
          value={sortOption}
          onChange={handleSortChange}
          label='Sort by'
          fullWidth
        >
          {sortItems.map((sortItem) => (
            <MenuItem id={sortItem.value} key={sortItem.value} value={sortItem.value}>
              {sortItem.selectText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default FilterSort