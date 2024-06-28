import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { getAllSubscriptions, createSubscription, updateSubscription, deleteSubscription } from '../../app/slices/subscriptionsSlice';
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
  TextField,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon , Delete as DeleteIcon } from '@mui/icons-material';
import styles from './SubscriptionComponent.module.css';
import { Subscription } from '../../app/interfaces/Subscription';
import { inputStyles } from '../Helpers';
import styled from '@mui/styled-engine';

// Estilos personalizados para el modal de confirmación
const ConfirmDeleteModalPaper = styled(Paper)`
  position: absolute;
  width: 30vw;
  height: 20vh;
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


interface SubscriptionManagerProps {
  subscriptions: Subscription[] | [];
  loading: boolean;
}

const SubscriptionComponent: React.FC  <SubscriptionManagerProps>  = (  {subscriptions , loading}  ) => {
  const dispatch = useDispatch<AppDispatch>();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleDeleteCandidate = (id: number) => {
    setDeleteCandidateId(id);
    setConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteCandidateId !== null) {
      dispatch(deleteSubscription(deleteCandidateId))
        .unwrap()
        .then(() => {
          setSnackbarSeverity('success');
          setSnackbarMessage('Subscripcion eliminada correctamente');
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setSnackbarSeverity('error');
          setSnackbarMessage('Error al eliminar la Subscripcion');
          setSnackbarOpen(true);
        })
        .finally(() => {
          setDeleteCandidateId(null);
          setConfirmDeleteModalOpen(false);
        });
    }
  };

  const handleCancelDelete = () => {
    setDeleteCandidateId(null);
    setConfirmDeleteModalOpen(false);
  };

  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, [dispatch]);

  const handleOpenModal = (subscription?: Subscription) => {
    if (subscription) {
      setCurrentSubscription(subscription);
      setModalType('edit');
    } else {
      setCurrentSubscription(null);
      setModalType('create');
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentSubscription(null);
  };

  const handleSaveSubscription = () => {
    if (currentSubscription) {
      const action = modalType === 'edit' ? updateSubscription(currentSubscription) : createSubscription(currentSubscription)
      dispatch(action)
        .unwrap()
        .then(() => {
          setSnackbarSeverity('success');
          setSnackbarMessage(`Subscripcion ${modalType !== 'edit' ? "creada" : "actualizada"} correctamente`);
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setSnackbarSeverity('error');
          setSnackbarMessage(`Error al ${modalType !== 'edit' ? "crear" : "actualizar"} la Subscripcion`);
          setSnackbarOpen(true);
        })
        .finally(() => {
          handleCloseModal();
        });
    }
  };

  return (
    <Box className={styles.container}>
      <div className={styles.headerContainer}>
        <Typography variant="h4">Subscripciones</Typography>
        <div>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => handleOpenModal()}
          >
            Nueva Subscripción
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ background: 'black', color: 'white' }} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ color: 'white' }}>Tipo</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            { loading ?
            <>
              <TableCell ></TableCell>
              <TableCell ></TableCell>
              <TableCell ></TableCell>
                <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height='40vh'
                > <CircularProgress style={{ color: 'white' }} size={44} /> </Box>
              <TableCell ></TableCell>
              <TableCell ></TableCell>
              <TableCell ></TableCell>
            </>:
              subscriptions.map((subscription) => (
                <TableRow key={subscription.id}>
                  <TableCell align="center" sx={{ color: 'white' }} className={styles.cell}>{subscription.type}</TableCell>
                  <TableCell align="center" sx={{ color: 'white' }} className={styles.cell}>
                    <IconButton onClick={() => handleOpenModal(subscription)}>
                      <EditIcon style={{ color: 'white' }} />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCandidate(subscription.id)}>
                      <DeleteIcon style={{ color: 'red' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box className={styles.modal}>
            <Typography variant="h6" className={styles.modalTitle}>
              {modalType === 'edit' ? 'Edición de Subscripción' : 'Creación de Subscripción'}
            </Typography>
            <Box sx={{ mb: 1, width: 120 }}></Box>

            <TextField
              fullWidth
              label="Tipo"
              name="type"
              value={currentSubscription?.type || ''}
              onChange={(e) => setCurrentSubscription({ ...currentSubscription ?? {id:0,type:''} , type: e.target.value })}
              sx={inputStyles}
            />
            <Box className={styles.modalButtons}>
              <Button variant="contained" color="primary" onClick={handleSaveSubscription}>
                Guardar
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
            </Box>
          </Box>
      </Modal>
        {/* Confirmación de eliminación */}
        <Modal
        open={confirmDeleteModalOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-modal"
        aria-describedby="confirm-delete-modal-description"
      >
        <ConfirmDeleteModalPaper>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmar eliminación
          </Typography>
          <Typography variant="body1" gutterBottom>
            ¿Está seguro que desea eliminar esta película?
          </Typography>
          <Box className={styles.confirmDeleteButtons}>
            <Button variant="contained" color="primary" onClick={handleConfirmDelete} style={{ marginRight: '8px' }}>
              Sí
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelDelete}>
              No
            </Button>
          </Box>
        </ConfirmDeleteModalPaper>
      </Modal>
      {/* Snackbar para mostrar mensajes */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' , color: 'white', background: 'black'}}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </Box>
  );

};

export default SubscriptionComponent;
