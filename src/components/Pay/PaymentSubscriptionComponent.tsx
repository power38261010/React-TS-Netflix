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
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
  Link, Card,
} from '@mui/material';
import { getAllSubscriptions } from '../../app/slices';
import { CardNumberParams } from '@mercadopago/sdk-react/secureFields/cardNumber/types';
import { useAuth } from '../../contexts/AuthContext';
import { Subscription } from '../../app/interfaces/Subscription';

const PaymentComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, refreshProfile } = useAuth();
  const { waypaysub, error } = useSelector((state: RootState) => state.payment);
  const [loadingPay, setloadingPay] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentRequest>({
    amount: 10000,
    token: '',
    description: 'Pago de subscripcion',
    paymentMethodId: '',
    payerEmail: 'test_user_123@testuser.com',
    isAnual: false,
    payId: 1,
  });
  console.log("expiration ", profile?.expirationDate?.toLocaleString().split('T')[0].split('-').reverse().join('/'))
  useEffect(() => {
    dispatch(getAllWayPayments());
    dispatch(getAllSubscriptions());
  }, [dispatch]);
  console.log("waypaysub ", waypaysub)
  const PUBLIC_KEY = process.env.PUBLIC_KEY ?? "TEST-c7aba999-edd1-4f0c-a1fc-ec68886af860";
  const MP_CARDS_TEST = process.env.MP_CARDS_TEST ?? "https://www.mercadopago.com.ar/developers/es/docs/adobe-commerce/additional-content/your-integrations/test/cards";
  initMercadoPago(PUBLIC_KEY);

  const [cardData, setCardData] = useState<CardPay>({
    cardholderName: 'APRO',
    identificationType: 'DNI',
    identificationNumber: '',
  });

  const nameSubscriptionSinceWP = (id: any) => {
    let wp = waypaysub.find((w) => w.id === id);
    return wp?.subscription?.type;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubscriptionChange = (event: { target: { value: any } }) => {
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

  const getMidpointDate = (futureDate: Date | string | number, sub: number): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!(futureDate instanceof Date)) {
      futureDate = new Date(futureDate);
    }
    futureDate.setHours(0, 0, 0, 0);

    if (futureDate <= today) {
      throw new Error("La fecha proporcionada debe ser posterior al día de hoy.");
    }

    const diffTime = futureDate.getTime() - today.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let halfDiffDays: number;
    let pay = waypaysub.find((w) => w.id === paymentData.payId);

    if (profile?.subscriptionId !== sub && sub === 2) {
      halfDiffDays = Math.floor(diffDays / 2);
    } else if (profile?.subscriptionId !== pay?.subscriptionId) {
      halfDiffDays = Math.floor(diffDays * 2);
    } else {
      halfDiffDays = diffDays;
    }

    const resultDate = new Date(today);
    resultDate.setDate(resultDate.getDate() + halfDiffDays);

    return resultDate;
  };

  const addTime = (date: Date): Date => {
    const result = new Date(date);

    if (paymentData.isAnual) {
      result.setFullYear(result.getFullYear() + 1);
    } else {
      result.setMonth(result.getMonth() + 1);
    }
    return result;
  };

  const getTotalExpirateDate = (sub :number): string => {
    if (profile?.isPaid && profile?.expirationDate !== undefined) {
      const expirationDate = new Date(profile.expirationDate);
      const midpointDate = getMidpointDate(expirationDate, sub);
      const dateResult = addTime(midpointDate);
      console.log("sub ",sub," expirationDate ",expirationDate," midpointDate ",midpointDate," dateResult ",dateResult)
      return '   Fecha de Expiracion: ' + dateResult.toDateString().split('T')[0].split('-').reverse().join('/') + '  ';
    }
    return '';
  }

  const fetchPaymentMethods = async (bin: any) => {
    try {
      const paymentMethods = await getPaymentMethods({ bin });
      if (paymentMethods !== undefined) return paymentMethods.results[0].id;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const handleRedirectMPCards = () => {
    window.open(MP_CARDS_TEST, '_blank');
  }

  const handleTokenGeneration = async () => {
    setloadingPay(true);
    try {
      const response = await createCardToken({
        cardholderName: cardData.cardholderName,
        identificationType: cardData.identificationType,
        identificationNumber: cardData.identificationNumber,
      });

      // Inspecciona completamente la estructura de la respuesta

      if (!!response && response.status === "active") {
        let bin = response.first_six_digits;
        let pm = await fetchPaymentMethods(bin) ?? '';
        let sub = nameSubscriptionSinceWP(paymentData.payId);
        let description = `Pago ${paymentData.isAnual ? 'anual' : 'mensual'} de la subscripcion ${sub}.`;

        const updatedPaymentData = {
          ...paymentData,
          token: response.id,
          paymentMethodId: pm,
          description: description
        };

        setPaymentData(updatedPaymentData);
        dispatch(createPayment(updatedPaymentData));
        await refreshProfile();
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
  // profile
  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={2} sx={{ backgroundColor: '#141414', minHeight: '100vh'}}>
      <Typography variant="h5" gutterBottom sx={{ color: 'white', marginTop: '7vh' }}>
        Selecciona una Subscripción para disfrutar de Netflix
      </Typography>
      { profile?.isPaid && (
      <Typography variant="h6" gutterBottom sx={{ color: 'white', marginTop: '3vh' }}>
        El {profile?.expirationDate?.toLocaleString().split('T')[0].split('-').reverse().join('/')} vence tu Subscripcion {profile?.subscription?.type}. 
         Es oportuno comentar que la computacion de dias de subscripcion es a razon de 2 dias Started = 1 dia Premium!
      </Typography>
      )}
      <Grid container spacing={3} sx={{ marginTop: '1vh' }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#333', color: '#fff' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={paymentData.isAnual}
                  onChange={handleIsAnualChange}
                  name="isAnual"
                  color="primary"
                />
              }
              label={ paymentData.isAnual? "Subscripcion Anual":"Subscripcion Mesual" }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ color: '#fff' }}>Subscripcion</InputLabel>
              <Select
                value={paymentData.payId}
                onChange={handleSubscriptionChange}
                sx={{ color: '#fff', borderColor: '#fff' }}
              >
                {waypaysub?.map((wayps, index) => (
                  <MenuItem key={index} value={wayps.id} sx={{ marginBottom: 2, input: { color: '#fff' }, '& .MuiOutlinedInput-root': { borderColor: '#fff' } }}>
                    <Box display="flex" flexDirection="column" sx={{ marginBottom: 2, input: { color: '#fff' }, '& .MuiOutlinedInput-root': { borderColor: '#fff' } }}>
                      <strong>{wayps.subscription?.type}</strong>
                      <strong>Precio ${paymentData.isAnual ? wayps.annualMultiplierPayment : wayps.monthlyPayment} {profile?.isPaid && getTotalExpirateDate(wayps.subscriptionId)}</strong>
                      
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <Typography variant="h6" gutterBottom sx={{ color: '#fff', marginTop: 2 }}>
          * Ten en cuenta que este Muro de Pago es un modelo de Prueba. Por lo que se sugiere elegir los datos de una de las tarjetas proveidas por{' '}
          <Link href="" onClick={handleRedirectMPCards} sx={{ color: 'cyan', cursor: 'pointer' }}>Mercado Pago</Link>
        </Typography>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2, backgroundColor: '#333', color: '#fff' }}>
            <Typography variant="h6" gutterBottom>Información del Titular de la Tarjeta</Typography>
            <TextField
              type="email"
              name="payerEmail"
              placeholder="Email del Pagador"
              value={paymentData.payerEmail}
              onChange={handleChange}
              fullWidth
              required
              sx={{ marginBottom: 2, input: { color: '#fff' }, '& .MuiOutlinedInput-root': { borderColor: '#fff' } }}
            />
            <TextField
              type="text"
              name="identificationType"
              placeholder="Tipo de Identificacion"
              value={cardData.identificationType}
              onChange={handleChangeCard}
              fullWidth
              required
              sx={{ marginBottom: 2, input: { color: '#fff' }, '& .MuiOutlinedInput-root': { borderColor: '#fff' } }}
            />
            <TextField
              type="text"
              name="identificationNumber"
              placeholder="Numero de Identificacion"
              value={cardData.identificationNumber}
              onChange={handleChangeCard}
              fullWidth
              required
              sx={{ marginBottom: 2, input: { color: '#fff' }, '& .MuiOutlinedInput-root': { borderColor: '#fff' } }}
            />
          </Paper>
        </Grid>
      </Grid>
      <Paper elevation={2} sx={{ padding: 2, backgroundColor: '#333', color: '#fff', marginTop: 3 }}>
        <Typography variant="h6" gutterBottom>Información de la Tarjeta</Typography>
        <Card sx={{ padding: 1, borderRadius: 4, backgroundColor: '#e0e0e0', color: '#fff', marginBottom: 0,
          minWidth:"80vh", minHeight:"40vh" }}>
          <CardNumber placeholder="Numero de Tarjeta" />
          <TextField
            type="text"
            name="cardholderName"
            placeholder="NOMBRE QUE FIGURA EN LA TARJETA"
            value={cardData.cardholderName}
            onChange={handleChangeCard}
            fullWidth
            required
            sx={{ marginBottom: 2, input: { color: 'black', textTransform: 'uppercase', fontSize: '12px' , textAlign:'left', mt:'-2px' }, '& .MuiOutlinedInput-root': { borderColor: '#fff' } }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1, marginRight: 1 }}>
              <ExpirationDate placeholder="MM/YY" />
            </Box>
            <Box sx={{ flex: 1, marginLeft: 1 }}>
              <SecurityCode placeholder="CVC" />
            </Box>
          </Box>
        </Card>
        <Button
          variant="contained"
          color="primary"
          onClick={handleTokenGeneration}
          disabled={loadingPay}
          fullWidth
          sx={{ mt: 2 }}
        >
          {error && <Typography variant="h6" bgcolor="red">Error: {error}</Typography>}
          {loadingPay ? <CircularProgress size={24} /> : 'Pagar'}
        </Button>
      </Paper>
    </Box>
  );
};

export default PaymentComponent;


