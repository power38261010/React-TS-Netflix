import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { payService } from '../../services/payService'; // Importa el servicio de pagos
import { Pay } from '../interfaces/Pay';

// Define una acción asíncrona para obtener todos los pagos
export const getAllPayments = createAsyncThunk('pays/getAllPayments', async () => {
  return payService.getAllPayments();
});

// Define una acción asíncrona para crear un pago
export const createPay = createAsyncThunk('pays/createPay', async (pay: Omit<Pay, 'id'>) => {
  return payService.createPay(pay);
});

// Define una acción asíncrona para actualizar un pago
export const updatePay = createAsyncThunk('pays/updatePay', async ({ id, pay }: { id: number, pay: Omit<Pay, 'id'> }) => {
  return payService.updatePay(id, pay);
});

// Define una acción asíncrona para eliminar un pago
export const deletePay = createAsyncThunk('pays/deletePay', async (id: number) => {
  await payService.deletePay(id);
  return id;
});

interface PaysState {
  pays: Pay[];
  loading: boolean;
  error: string | null;
}

const initialState: PaysState = {
  pays: [],
  loading: false,
  error: null,
};

const handlePending = (state: PaysState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: PaysState, action: any) => {
  state.loading = false;
  state.error = action.error.message ?? 'Error al realizar la acción';
};

const paysSlice = createSlice({
  name: 'pays',
  initialState,
  reducers: {
    // Define otras acciones necesarias
  },
  extraReducers: builder => {
    builder
      .addCase(getAllPayments.pending, handlePending)
      .addCase(getAllPayments.fulfilled, (state, action: PayloadAction<Pay[]>) => {
        state.loading = false;
        state.pays = action.payload;
      })
      .addCase(getAllPayments.rejected, handleRejected)

      .addCase(updatePay.pending, handlePending)
      .addCase(updatePay.fulfilled, (state, action: PayloadAction<Pay>) => {
        state.loading = false;
        const index = state.pays.findIndex(pay => pay.id === action.payload.id);
        if (index !== -1) {
          state.pays[index] = action.payload;
        }
      })
      .addCase(updatePay.rejected, handleRejected)

      .addCase(deletePay.pending, handlePending)
      .addCase(deletePay.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.pays = state.pays.filter(pay => pay.id !== action.payload);
      })
      .addCase(deletePay.rejected, handleRejected)

  },
});

export default paysSlice.reducer;
