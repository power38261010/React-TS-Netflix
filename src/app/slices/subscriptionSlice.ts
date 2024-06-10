import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { subscriptionService } from '../../services/subscriptionService';
import { Subscription } from '../interfaces/Subscription';

// Acciones asíncronas para operaciones CRUD
export const getAllSubscriptions = createAsyncThunk('subscriptions/getAllSubscriptions', async () => {
  return subscriptionService.getAllSubscriptions();
});

// export const getSubscriptionById = createAsyncThunk('subscriptions/getSubscriptionById', async (id: number) => {
//   return subscriptionService.getSubscriptionById(id);
// });

export const createSubscription = createAsyncThunk('subscriptions/createSubscription', async (subscription: Omit<Subscription, 'id'>) => {
  return subscriptionService.createSubscription(subscription);
});

export const updateSubscription = createAsyncThunk('subscriptions/updateSubscription', async (subscription: Subscription) => {
  await subscriptionService.updateSubscription(subscription.id, subscription);
  return subscription;
});

export const deleteSubscription = createAsyncThunk('subscriptions/deleteSubscription', async (id: number) => {
  await subscriptionService.deleteSubscription(id);
  return id;
});

interface SubscriptionsState {
  subscriptions: Subscription[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionsState = {
  subscriptions: [],
  loading: false,
  error: null,
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    addSubscription: (state, action: PayloadAction<Subscription>) => {
      state.subscriptions.push(action.payload);
    },
    removeSubscription: (state, action: PayloadAction<number>) => {
      state.subscriptions = state.subscriptions.filter(sub => sub.id !== action.payload);
    },
    getSubscriptionById: (state, action: PayloadAction<Subscription>) => {
      const subscription = state.subscriptions.find(sub => sub.id === action.payload.id);
      if (subscription) {
        Object.assign(subscription, action.payload);
      } else {
        state.subscriptions.push(action.payload);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getAllSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSubscriptions.fulfilled, (state, action: PayloadAction<Subscription[]>) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(getAllSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching subscriptions';
      })

      .addCase(createSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.loading = false;
        state.subscriptions.push(action.payload);
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error creating subscription';
      })

      .addCase(updateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.loading = false;
        const index = state.subscriptions.findIndex(sub => sub.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error updating subscription';
      })

      .addCase(deleteSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubscription.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.subscriptions = state.subscriptions.filter(sub => sub.id !== action.payload);
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error deleting subscription';
      });
  },
});

export const { addSubscription, removeSubscription, getSubscriptionById } = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;
