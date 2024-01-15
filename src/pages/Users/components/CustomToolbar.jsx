import { Box } from '@mui/material'
import {
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarFilterButton,
  GridToolbarQuickFilter } from '@mui/x-data-grid'

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter sx={{ ml: 1 }} />
      <Box sx={{ ml: 'auto' }}>
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
      </Box>
    </GridToolbarContainer>
  )
}

export default CustomToolbar