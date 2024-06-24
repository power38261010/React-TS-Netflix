import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { getAllSubscriptions, createSubscription, updateSubscription } from '../../app/slices/subscriptionsSlice';
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
  TextField
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import styles from './SubscriptionComponent.module.css';
import { Subscription } from '../../app/interfaces/Subscription';
import styled from '@mui/styled-engine';
import { inputStyles } from '../Helpers';

// interface SubscriptionManagerProps {
//   subscriptions: Subscription[] | [];
// }

const SubscriptionComponent: React.FC /* <SubscriptionManagerProps> **/ = ( /* {subscriptions} **/ ) => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions } = useSelector((state: RootState) => state.subscriptions);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);

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
      if (modalType === 'edit') {
        dispatch(updateSubscription(currentSubscription));
      } else {
        dispatch(createSubscription(currentSubscription));
      }
    }
    handleCloseModal();
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
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell align="center" sx={{ color: 'white' }} className={styles.cell}>{subscription.type}</TableCell>
                <TableCell align="center" sx={{ color: 'white' }} className={styles.cell}>
                  <IconButton onClick={() => handleOpenModal(subscription)}>
                    <EditIcon style={{ color: 'white' }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <ConfirmDeleteModalPaper>
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
          </ConfirmDeleteModalPaper>
      </Modal>
    </Box>
  );

};

export default SubscriptionComponent;
