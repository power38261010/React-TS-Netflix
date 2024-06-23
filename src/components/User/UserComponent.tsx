import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { searchUsers, softDeleteUser, upUser } from '../../app/slices/usersSlice';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  TextField,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import styles from './UserComponent.module.css';
import { roles, inputStyles, selectStyles } from '../Helpers';
import styled from '@mui/styled-engine';
import { Profile } from '../../contexts/AuthContext';
import { Subscription } from '../../app/interfaces/Subscription';

interface ProfileManagerProps {
  profile: Profile | null;
  subscriptions: Subscription[];
}

const UserComponent: React.FC <ProfileManagerProps>= ({profile,  subscriptions}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { users } = useSelector((state: RootState) => state.users);

  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);
  const [upUserId, setUpUserId] = useState<number | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedSearchRole, setSelectedSearchRole] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaid, setIsPaid] = useState<boolean | undefined>(undefined);
  const [subscriptionType, setSubscriptionType] = useState<string >('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    handleSearch();
  }, [dispatch, selectedSearchRole,  isPaid,  subscriptionType,  pageIndex,  pageSize]);

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDeleteCandidate = (id: number) => {
    setDeleteCandidateId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteCandidateId !== null) {
      dispatch(softDeleteUser(deleteCandidateId));
      setDeleteCandidateId(null);
    }
  };

  const handleUpUser = (id: number) => {
    setUpUserId(id);
  };

  const handleConfirmUpUser = () => {
    if (upUserId !== null && selectedRole !== '') {
      dispatch(upUser({ id: upUserId, role: selectedRole }));
      setUpUserId(null);
      setSelectedRole('');
    }
  };

  const handlePaidSelect = (value :any) => {
    if (value === 'undefined') setIsPaid(undefined)
    else if ( value === 'true') setIsPaid(true)
    else  setIsPaid(false)
  }

  const handleSearch = () => {
    dispatch (searchUsers({searchTerm: searchTerm,  role: selectedSearchRole, isPaid: isPaid,
      subscriptionType: subscriptionType, pageIndex: pageIndex,   pageSize: pageSize
    }))
  }

  const handleCancelAction = () => {
    setDeleteCandidateId(null);
    setUpUserId(null);
    setSelectedRole('');
  };

  const ConfirmDeleteModalPaper = styled(Paper)`
  position: absolute;
  width: 30vw;
  height: 22vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #141414; /* Color oscuro estilo Netflix */
  color: white; /* Texto blanco */
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

  return (
    <Box className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.search}>
          <TextField
            fullWidth
            size='small'
            label="Buscar"
            name="searchTerm"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={inputStyles}
          />
          <SearchIcon className={styles.searchIcon} onClick={handleSearch} />
        </div>
        <div className={styles.genreSelectContainer}>
          <FormControl variant="outlined" size='small' fullWidth sx={selectStyles}>
            <InputLabel id="genre-select-label">Rol</InputLabel>
            <Select
              value={selectedSearchRole}
              onChange={(e) => setSelectedSearchRole(e.target.value as string)}
              label="Rol"
              className={styles.selector}
            >
              <MenuItem key="Todos" selected={(selectedSearchRole === '')} value=""><em>Todos</em></MenuItem>
              {roles.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={styles.genreSelectContainer}>
          <FormControl variant="outlined" size='small' fullWidth sx={selectStyles}>
            <InputLabel id="subscription-select-label">Abonados</InputLabel>
            <Select
              value={isPaid}
              onChange={(e) => handlePaidSelect(e.target.value)}
              label="Abonados"
              className={styles.selector}
            >
              <MenuItem key="Todos" selected={(isPaid === undefined)} value='undefined'><em>Todos</em></MenuItem>
                <MenuItem key='abono' value='true'>Pagaron</MenuItem>
                <MenuItem key='no-abono' value='false'>No Pagaron</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={styles.genreSelectContainer}>
          <FormControl variant="outlined" size='small' fullWidth sx={selectStyles}>
              <InputLabel id="subscription-select-label">Subscripcion</InputLabel>
              <Select
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value)}
                label="Subscripcion"
                className={styles.selector}
              >
                <MenuItem key="Todos" selected={(subscriptionType === undefined)} value=""><em>Todos</em></MenuItem>
                {subscriptions.map((sub) => (
                  <MenuItem key={sub.id} value={sub.type}>{sub.type}</MenuItem>
                ))}
              </Select>
            </FormControl>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ background: 'black', color: 'white' }} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }} >Rol</TableCell>
              <TableCell sx={{ color: 'white' }} >Usuario</TableCell>
              <TableCell sx={{ color: 'white' }} >Email</TableCell>
              <TableCell sx={{ color: 'white' }} >Abono</TableCell>
              <TableCell sx={{ color: 'white' }} >Subscripción</TableCell>
              <TableCell sx={{ color: 'white' }} >Expiración de Subscripción</TableCell>
              <TableCell sx={{ color: 'white' }} >Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell sx={{ color: user.role === 'client' ? 'white' : 'yellow' }} className={styles.cell} >{ (user.role === '' || user.role === null)  ?  'Eliminado' : user.role }</TableCell>
                <TableCell sx={{ color: user.role === 'client' ? 'white' : 'yellow' }} className={styles.cell} >{user.username ?? 'Sin username'}</TableCell>
                <TableCell sx={{ color: user.role === 'client' ? 'white' : 'yellow' }} className={styles.cell} >{user.email ?? 'Sin email'}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell} >{user.isPaid ? 'Si' : 'No'}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell} >{subscriptions.find((s) => s.id === user.subscriptionId)?.type ?? 'Sin Subscripcion'}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell} >{  user?.expirationDate?.toString().split('T')[0].split('-').reverse().join('/')  ?? 'Sin Fecha'}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell} >
                  { profile?.role === 'super_admin' && user?.role !== 'super_admin' && (
                    <IconButton  onClick={() => handleUpUser(user.id)}>
                      <EditIcon style={{ color: 'white' }} />
                    </IconButton>
                  )}
                  { user?.role !== 'super_admin' && (
                    <IconButton onClick={() => handleDeleteCandidate(user.id)}>
                      <DeleteIcon style={{ color: 'red' }} />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className={styles.pagination}>
        <Button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 1}>{"<"}</Button>
        <Typography variant="body2">{pageIndex}</Typography>
        <Button onClick={() => setPageIndex(pageIndex + 1)} disabled={users.length < pageSize}>{">"}</Button>
      </Box>

      {/* Modal para confirmación de eliminación */}
      <Modal
        open={deleteCandidateId !== null}
        onClose={handleCancelAction}
        aria-labelledby="confirm-delete-modal"
        aria-describedby="confirm-delete-modal-description"
      >
        <ConfirmDeleteModalPaper>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmar eliminación
          </Typography>
          <Typography variant="body1" gutterBottom>
            ¿Está seguro que desea eliminar este usuario?
          </Typography>
          <Box className={styles.confirmActionButtons}>
            <Button variant="contained" color="primary" onClick={handleConfirmDelete}>
              Sí
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelAction}>
              No
            </Button>
          </Box>
        </ConfirmDeleteModalPaper>
      </Modal>

      {/* Modal para actualizar rol */}
      <Modal
        open={upUserId !== null}
        onClose={handleCancelAction}
        aria-labelledby="update-role-modal"
        aria-describedby="update-role-modal-description"
      >
        <ConfirmDeleteModalPaper>
          <Typography variant="h6" component="h2" gutterBottom>
            Actualizar Rol
          </Typography>
          <FormControl variant="outlined" size='small' fullWidth sx={selectStyles}>
            <InputLabel id="select-role-label">Seleccionar Rol</InputLabel>
            <Select
              labelId="select-role-label"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as string)}
              label="Seleccionar Rol"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="client">Client</MenuItem>
            </Select>
          </FormControl>
          <Box className={styles.confirmActionButtons}>
            <Button variant="contained" color="primary" onClick={handleConfirmUpUser}>
              Guardar
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelAction}>
              Cancelar
            </Button>
          </Box>
        </ConfirmDeleteModalPaper>
      </Modal>

    </Box>
  );
};

export default UserComponent;