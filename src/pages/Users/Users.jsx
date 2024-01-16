import { useEffect, useMemo, useState } from 'react'
import userService from '../../services/users'
import { Container, Typography } from '@mui/material'
import { format, parseISO } from 'date-fns'
import { DataGrid, GridActionsCellItem,
  GridRowModes, GridRowEditStopReasons } from '@mui/x-data-grid'
import { Link } from 'react-router-dom'
import Progress from '../../components/Progress'
import { CancelOutlined, DeleteOutlined,
  EditOutlined, SaveOutlined } from '@mui/icons-material'
import Redirect from '../../components/Redirect'
import { useConfirm } from 'material-ui-confirm'
import CustomToolbar from './components/CustomToolbar'
import { useSnackbar } from 'notistack'

const Users = ({ user }) => {
  const [users, setUsers] = useState([])
  const [rowModesModel, setRowModesModel] = useState({})
  const [rowSelectionModel, setRowSelectionModel] = useState([])
  const [error, setError] = useState(null)
  const confirm = useConfirm()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (user) {
      if (user.role === 'moderator') {
        userService.getUsers()
          .then(response => {
            setUsers(response)
          })
          .catch(error => {
            console.log(error)
            setError(error)
          })
      } else if (user.role === 'admin') {
        userService.getAllUsers()
          .then(response => {
            setUsers(response)
          })
          .catch(error => {
            console.log(error)
            setError(error)
          })
      } else {
        setError('Access denied')
      }
    } else {
      setError('Access denied')
    }
  }, [])

  const columnVisibilityModel = useMemo(() => {
    if (user.role === 'admin') {
      return {
        role: true
      }
    }
    return {
      role: false
    }
  }, [user])

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
    if (user.role === 'admin') {
      const user = users.find((u) => u.id === id)
      confirm({
        title: 'Delete user?',
        description: user.name,
        confirmationText: 'Delete', dialogProps: {
          id: 'delete-user-confirm',
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
    } else {
      enqueueSnackbar('Only admins are allowed to delete users',
        { variant: 'error' })
    }
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
    if (user.role === 'moderator') {
      userService.editDisabled(newRow.id, newRow)
        .then(() => {})
        .catch(error => {
          console.log(error)
        })
    } else if (user.role === 'admin') {
      userService.editUser(newRow.id, newRow)
        .then(() => {})
        .catch(error => {
          console.log(error)
        })
    }
    const updatedRow = { ...newRow, isNew: false }
    setUsers(users.map((row) => (row.id === newRow.id ? updatedRow : row)))
    return updatedRow
  }
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel)
  }

  const columns = [
    { field: 'id', type: 'number', headerName: 'ID', flex: 0.3, headerAlign: 'left', align: 'left' },
    { field: 'name', headerName: 'Name', flex: 0.8, renderCell: (params) => (
      <Link to={`/users/${params.row.id}`}>{params.value}</Link>
    ) },
    { field: 'email', headerName: 'Email address', flex: 1.2 },
    { field: 'role', type: 'singleSelect', valueOptions: ['user', 'moderator'],
      headerName: 'Role', flex: 0.5, editable: true },
    { field: 'disabled', headerName: 'Disabled?', flex: 0.6, editable: true, type: 'boolean' },
    { field: 'createdAt', headerName: 'Account created', flex: 0.7, valueFormatter: (params) => {
      if (params.value === null) {
        return ''
      }
      return format(parseISO(params.value), 'dd.MM.yyyy')
    } },
    { field: 'reviews', headerName: 'Reviews', flex: 0.4, renderCell: (params) => (
      <Link to={`/myreviews/${params.row.id}`}>Check</Link>
    ) },
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
        columnVisibilityModel={columnVisibilityModel}
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