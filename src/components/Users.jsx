import { useEffect, useState } from 'react'
import userService from '../services/users'
import { Container, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { DataGrid, GridActionsCellItem,
  GridRowModes, GridRowEditStopReasons } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import Progress from './Progress'
import { CancelOutlined, DeleteOutlined,
  EditOutlined, SaveOutlined } from '@mui/icons-material'
import Redirect from './Redirect'
import { useConfirm } from 'material-ui-confirm'
import CustomToolbar from './CustomToolbar'

const Users = () => {
  const [users, setUsers] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [rowSelectionModel, setRowSelectionModel] = useState([])
  const [error, setError] = useState(null)
  const confirm = useConfirm()

  useEffect(() => {
    userService.getAllUsers()
      .then(response => {
        setUsers(response)
      })
      .catch(error => {
        console.log(error)
        setError(error)
      })
  }, [])

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true
    }
  }
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } })
  }
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } })
  }
  const handleDeleteClick = (id) => () => {
    const user = users.find((u) => u.id === id)
    confirm({
      title: 'Delete user?',
      description: user.name,
      confirmationText: 'Delete', dialogProps: {
        PaperProps: {
          sx: {
            width: 'auto',
            minWidth: '13%'
          }
        }
      } })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id))
        userService.removeUser(id)
          .then(() => {})
          .catch((error) => {
            console.log(error)
          })
      })
      .catch(() => {})
  }
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    })

    const editedRow = users.find((row) => row.id === id)
    if (editedRow.isNew) {
      setUsers(users.filter((row) => row.id !== id))
    }
  }
  const processRowUpdate = (newRow) => {
    userService.editUser(newRow.id, newRow)
      .then(() => {})
      .catch(error => {
        console.log(error)
      })
    const updatedRow = { ...newRow, isNew: false }
    setUsers(users.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns = [
    { type: 'number', field: 'id', headerName: 'ID', flex: 0.3, headerAlign: 'left', align: 'left' },
    { field: 'name', headerName: 'Name', flex: 1, renderCell: (params) => (
      <Link to={`/users/${params.row.id}`}>{params.value}</Link>
    ) },
    { field: 'email', headerName: 'Email address', flex: 1.5 },
    { field: 'disabled', headerName: 'Disabled?', flex: 0.5, editable: true,
      type: 'boolean' },
    { field: 'createdAt', headerName: 'Account created', flex: 1, valueFormatter: (params) => {
      if (params.value === null) {
        return ''
      }
      return format(parseISO(params.value), 'dd.MM.yyyy')
    } },
    { field: 'reviews', headerName: 'Reviews', flex: 0.5 },
    { field: 'actions', type: 'actions', headerName: 'Actions', cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveOutlined />}
              label='Save'
              sx={{ color: 'primary.main' }}
              onClick={handleSaveClick(id)}
              key={id}
            />,
            <GridActionsCellItem
              icon={<CancelOutlined />}
              label='Cancel'
              className='textPrimary'
              onClick={handleCancelClick(id)}
              conlor='inherit'
              key={id}
            />
          ]
        }

        return [
          <GridActionsCellItem
            icon={<EditOutlined />}
            label='Edit'
            className='textPrimary'
            onClick={handleEditClick(id)}
            color='inherit'
            key={id}
          />,
          <GridActionsCellItem
            icon={<DeleteOutlined />}
            label='Delete'
            onClick={handleDeleteClick(id)}
            color='inherit'
            key={id}
          />
        ]
      } }
  ]

  if (error) {
    return (
      <Redirect />
    )
  }
  if (!users || users.length === 0) {
    return (
      <Progress />
    )
  }

  return (
    <Container>
      <Typography
        variant='h6'
        fontWeight='bold'
        gutterBottom
        sx={{
          mt: 2,
          mb: 1,
          ml: 1
        }}
      >
      User management
      </Typography>
      <DataGrid
        rows={users}
        columns={columns}
        editMode='row'
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel)
        }}
        rowSelectionModel={rowSelectionModel}
        slots={{ toolbar: CustomToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          }
        }}
        initialState={{
          pagination: {
            ...users.initialState?.pagination,
            paginationModel: { pageSize: 10 },
          },
          sorting: {
            sortModel: [{ field: 'disabled', sort: 'desc' }]
          }
        }}
        pageSizeOptions={[10,25]}
      />
    </Container>
  )
}

export default Users