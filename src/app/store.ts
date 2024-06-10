import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import moviesReducer from './slices/moviesSlice';
import paysReducer from './slices/paysSlice';
import subscriptionsReducer from './slices/subscriptionsSlice';
import counterSlice from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    movies: moviesReducer,
    pays: paysReducer,
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

// export default store;










// import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import counterReducer from '../features/counter/counterSlice';

// export const store = configureStore({
//   reducer: {
//     counter: counterReducer,
//   },
// });

// export type AppDispatch = typeof store.dispatch;
// export type RootState = ReturnType<typeof store.getState>;
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;
