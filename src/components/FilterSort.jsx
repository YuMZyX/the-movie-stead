import { Box, TextField, Select, MenuItem, FormControl,
  InputLabel, InputAdornment } from '@mui/material'
import { SearchRounded } from '@mui/icons-material'

const FilterSort = ({ filter, sortOption, handleFilterChange,
  handleSortChange, sortItems, label }) => {

  return (
    <Box sx={{ display: 'flex', mb: 2 }}>
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
      <FormControl sx={{ minWidth: 230 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          label='Sort By'
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