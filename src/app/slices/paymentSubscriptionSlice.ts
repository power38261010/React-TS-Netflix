import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentRequest, PaymentResponse, PaySubscription } from '../interfaces/PaymentSubscription';
import { Pay } from '../interfaces/Pay';
import api from '../../services/api';

export const createPayment = createAsyncThunk(
  'payment/createPayment',
  async (paymentData: PaymentRequest) => {
    const response = await api.post('/payments/create-payment', paymentData);
    console.log("response  createPayment",response)
    return response.data;
  }
);

export const getAllPaymentSubscriptions = createAsyncThunk(
  'payment/getAllPaymentSubscriptions',
  async () => {
    const response = await api.get('/payments/pay-subscriptions');
    console.log("response  getAllPaymentSubscriptions",response)
    return response.data;
  }
);

export const getAllWayPayments = createAsyncThunk(
  'payment/getAllWayPayments',
  async () => {
    const response = await api.get('/payments/ars');
    console.log("response  getAllWayPayments",response)
    return response.data;
  }
);

interface PaymentState {
  payment: PaymentResponse | null;
  paysub : PaySubscription[] | [];
  waypaysub : Pay[] | [];
  loading: boolean;
  error: string | null;
}


const initialState: PaymentState = {
  payment: null,
  paysub : [],
  waypaysub : [],
  loading: false,
  error: null,
};



const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to process payment';
        state.payment = null;

      })

      .addCase(getAllPaymentSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPaymentSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.paysub = action.payload;
      })
      .addCase(getAllPaymentSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to process payment';
        state.paysub = [];
      })

      .addCase(getAllWayPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWayPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.waypaysub = action.payload;
      })
      .addCase(getAllWayPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to process payment';
        state.waypaysub = [];
      });
  },
});

export default paymentSlice.reducer;
