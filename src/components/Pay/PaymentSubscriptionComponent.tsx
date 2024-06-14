import React, { useEffect, useState } from 'react';
import {
  initMercadoPago,
  createCardToken,
  CardNumber,
  SecurityCode,
  ExpirationDate,
  getPaymentMethods,
} from '@mercadopago/sdk-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { createPayment, getAllWayPayments } from '../../app/slices/paymentSubscriptionSlice';
import { PaymentRequest } from '../../app/interfaces/PaymentSubscription';
import { CardPay } from '../../app/interfaces/CardPay';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, Typography, CircularProgress, FormControlLabel, Switch } from '@mui/material';
import { getAllSubscriptions } from '../../app/slices';

const PaymentComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { waypaysub , error } = useSelector((state: RootState) => state.payment);
  const { subscriptions } = useSelector((state: RootState) => state.subscriptions);
  const [loadingPay, setloadingPay] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentRequest>({
    amount: 10000,
    token: '',
    description: 'Pago de subscripcion',
    paymentMethodId: '',
    payerEmail: 'test_user_123@testuser.com',
    isAnual: false,
    payId: 1
    });

  useEffect(() => {
    dispatch(getAllWayPayments());
    dispatch(getAllSubscriptions());
  }, [dispatch]);

  const PUBLIC_KEY = process.env.PUBLIC_KEY ?? "TEST-c7aba999-edd1-4f0c-a1fc-ec68886af860";
  initMercadoPago(PUBLIC_KEY);

  const [cardData, setCardData] = useState<CardPay>({
    cardholderName: 'APRO',
    identificationType: 'DNI',
    identificationNumber: '',
  });

  const nameSubscription = (id: any) => {
    let sub = subscriptions.find((s) => s.id === id);
    return !!sub ? sub.type : "";
  };

  const nameSubscriptionSinceWP = ( id : any) => {
    let wp = waypaysub.find((w)=> w.id === id);
    return nameSubscription (wp?.subscriptionId);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubscriptionChange = (event: { target: { value: any; }; }) => {
    const { value } = event.target;
    setPaymentData((prevData) => ({
      ...prevData,
      payId: value,
    }));
  };

  const handleIsAnualChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData((prevData) => ({
      ...prevData,
      isAnual: event.target.checked,
    }));
  };

  const handleChangeCard = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const fetchPaymentMethods = async (bin: any) => {
    try {
      const paymentMethods = await getPaymentMethods({ bin });
      if (paymentMethods !== undefined) return paymentMethods.results[0].id;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleTokenGeneration = async () => {
    setloadingPay(true);
    try {
    const response = await createCardToken({
      cardholderName: cardData.cardholderName,
      identificationType: cardData.identificationType,
      identificationNumber: cardData.identificationNumber,
    });
    if (!!response && response.status === "active") {
      let bin = response.first_six_digits;
      let pm = await fetchPaymentMethods(bin) ?? '';
      let sub = nameSubscriptionSinceWP( paymentData.payId );
      let description = `Pago ${paymentData.isAnual ? 'anual' : 'mensual'} de la subscripcion ${ sub }.`;

      const updatedPaymentData = {
        ...paymentData,
        token: response.id,
        paymentMethodId: pm,
        description: description
      };

      setPaymentData(updatedPaymentData);
      dispatch(createPayment(updatedPaymentData));
      setloadingPay(false);
      setPaymentSuccess(true);
    }
  } catch (error) {
    setloadingPay(false);
    console.error('Error fetching createCardToken:', error);
  }
  };

  if (paymentSuccess) {
    return <Typography variant="h4">¡Pago exitoso!</Typography>;
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2}>
      <Typography variant="h4" gutterBottom>Selecciona una Subscripcion para disfrutar de Netflix</Typography>
      <FormControlLabel
        control={
          <Switch
            checked={paymentData.isAnual}
            onChange={handleIsAnualChange}
            name="isAnual"
            color="primary"
          />
        }
        label="Es anual"
      />
      <FormControl fullWidth margin="normal">
        <Select
          value={paymentData.payId}
          onChange={handleSubscriptionChange}
          label="Subscripcion"
        >
          {waypaysub.map((wayps, index) => (
            <MenuItem key={index} value={wayps.id}>
              <Box display="flex" flexDirection="column">
                <strong>{nameSubscription(wayps.subscriptionId)}</strong>
                <strong>Precio ${paymentData.isAnual ? wayps.annualMultiplierPayment : wayps.monthlyPayment}</strong>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography variant="h4" gutterBottom>Muro de Pago</Typography>
      <TextField
        type="email"
        name="payerEmail"
        placeholder="Email del Pagador"
        value={paymentData.payerEmail}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        type="text"
        name="identificationType"
        placeholder="Tipo de Identificacion"
        value={cardData.identificationType}
        onChange={handleChangeCard}
        fullWidth
        required
      />
      <TextField
        type="text"
        name="identificationNumber"
        placeholder="Numero DNI"
        value={cardData.identificationNumber}
        onChange={handleChangeCard}
        fullWidth
        required
      />
      <TextField
        type="text"
        name="cardholderName"
        placeholder="Nombre que figura en la Tarjeta"
        value={cardData.cardholderName}
        onChange={handleChangeCard}
        fullWidth
        required
      />
      <CardNumber placeholder='Card Number' />
      <SecurityCode placeholder='Security Code' />
      <ExpirationDate placeholder='Expiration Date' mode='short' />
      <Button
        variant="contained"
        color="primary"
        onClick={handleTokenGeneration}
        disabled={loadingPay}
        fullWidth
        sx={{ mt: 2 }}
      >
        {error && <Typography variant="h6" bgcolor="red" >Error:{error} </Typography>}
        {loadingPay ? <CircularProgress size={24} /> : 'Pagar'}
      </Button>
    </Box>
  );
};

export default PaymentComponent;
