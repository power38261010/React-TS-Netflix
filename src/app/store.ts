import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import moviesReducer from './slices/moviesSlice';
import paysReducer from './slices/paysSlice';
import paymentReducer from './slices/paymentSubscriptionSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';
import counterSlice from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    movies: moviesReducer,
    pays: paysReducer,
    payment: paymentReducer,
    subscriptions: subscriptionsReducer,
    counters: counterSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
