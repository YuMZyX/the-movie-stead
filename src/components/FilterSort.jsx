import { Box, TextField, Select, MenuItem, FormControl,
  InputLabel, InputAdornment } from '@mui/material'
import { SearchRounded } from '@mui/icons-material'

const FilterSort = ({ filter, sortOption, handleFilterChange,
  handleSortChange, sortItems, label, isMobile }) => {

  const flexDirection = isMobile ? 'column' : 'row'
  const marginTop = isMobile ? 1.5 : 0

  return (
    <Box sx={{ display: 'flex', flexDirection: flexDirection, mb: 2, mt: 2 }}>
      <TextField
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
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          label='Sort By'
          fullWidth
        >
          {sortItems.map((sortItem) => (
            <MenuItem key={sortItem.value} value={sortItem.value}>
              {sortItem.selectText}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default FilterSort