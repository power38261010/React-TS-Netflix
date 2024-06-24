import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { createPay, getAllPayments, updatePay } from '../../../app/slices/paysSlice';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import styles from './PayComponent.module.css';
import { Pay } from '../../../app/interfaces/Pay';
import { Subscription } from '../../../app/interfaces/Subscription';
import styled from '@mui/styled-engine';
import { inputStyles, selectStyles } from '../../Helpers';
import { getAllSubscriptions } from '../../../app/slices';

interface PayManagerProps {
  pays: Pay[] | [];
  subscriptions: Subscription[];
}

const PayComponent: React.FC /* <PayManagerProps>  **/ = (/* { pays, subscriptions } **/) => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions } = useSelector((state: RootState) => state.subscriptions);
  const { pays } = useSelector((state: RootState) => state.pays);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [currentPay, setCurrentPay] = useState<Pay>({
    id: 0,
    currency: '',
    monthlyPayment: 0,
    subscriptionId: 1
  });


  useEffect(() => {
    dispatch(getAllPayments());
    dispatch(getAllSubscriptions());
  }, [dispatch]);

  const ConfirmDeleteModalPaper = styled(Paper)`
    position: absolute;
    width: 25vw;
    height: 35vh;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #141414;
    color: white;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `;

  const handleOpenModal = (pay?: Pay) => {
    if (pay) {
      setCurrentPay(pay);
      setModalType('edit');
    } else {
      setCurrentPay({
        id: 0,
        currency: '',
        monthlyPayment: 0,
        subscriptionId: 0
      });
      setModalType('create');
    }
    setModalOpen(true);
  };
  const handleSubscriptionChange = (event: any) => {
    const {
      target: { value },
    } = event;
    setCurrentPay((prevPay) => ({
      ...prevPay,
      subscriptionId: parseInt(value as string)
    }));
  }
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setCurrentPay((prevPay) => ({
      ...prevPay,
      [name!]: name === 'monthlyPayment' ? parseInt(value as string) : value
    }));
  }, []);

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentPay({
      id: 0,
      currency: '',
      monthlyPayment: 0,
      subscriptionId: 0
    });
  };

  const handleSavePay = () => {
    if (currentPay) {
      if (modalType === 'edit') {
        dispatch(updatePay({ id: currentPay.id ?? 0, pay: currentPay }));
      } else {
        dispatch(createPay(currentPay));
      }
    }
    handleCloseModal();
  };

  return (
    <Box className={styles.container}>
      <div className={styles.headerContainer}>
        <Typography variant="h4">Pagos</Typography>
        <div className={styles.genreSelectContainer}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            onClick={() => handleOpenModal()}
          >
            Nuevo Pago
          </Button>
        </div>
      </div>
      <TableContainer component={Paper} sx={{ background: 'black', color: 'white' }} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Moneda</TableCell>
              <TableCell sx={{ color: 'white' }}>Valor Mensual</TableCell>
              <TableCell sx={{ color: 'white' }}>Subscripción</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pays.map((pay) => (
              <TableRow key={pay.id}>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>{pay.currency}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>{pay.monthlyPayment}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>
                  {subscriptions.find((sub) => sub.id === pay.subscriptionId)?.type ?? 'Sin Subscripcion'}
                </TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>
                  <IconButton onClick={() => handleOpenModal(pay)}>
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
          <Typography variant="h6" sx={{ mb: 4 }} className={styles.modalTitle}>
            {modalType === 'edit' ? 'Edición de Pago' : 'Creación de Pago'}
          </Typography>
          <Box sx={{ mb: 1 }}>
            <TextField
              fullWidth
              label="Moneda"
              name="currency"
              value={currentPay.currency || ''}
              onChange={handleInputChange}
              sx={inputStyles}
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <TextField
              fullWidth
              label="Monto Mensual"
              type="number"
              name="monthlyPayment"
              value={currentPay.monthlyPayment || 0}
              onChange={handleInputChange}
              sx={inputStyles}
            />
          </Box>
          <Box sx={{ mb: 1, width: 120 }}>
            <FormControl variant="outlined" size="small" fullWidth sx={selectStyles}>
              <InputLabel id="subscription-select-label">Subscripción</InputLabel>
              <Select
                value={currentPay.subscriptionId || 1}
                onChange={(e)=> handleSubscriptionChange(e)}
                name='subscriptionId'
                label="Subscripción"
              >
                {subscriptions.map((subscription) => (
                  <MenuItem key={subscription.id} value={subscription.id}>
                    {subscription.type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box className={styles.modalButtons}>
            <Button variant="contained" color="primary" onClick={handleSavePay}>
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

export default PayComponent;
