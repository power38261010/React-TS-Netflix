import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '../../services/userService';
import { User } from '../interfaces/User';

// Acciones asíncronas para operaciones CRUD
export const searchUsers = createAsyncThunk('users/searchUsers', async ({
  username,
  role,
  expirationDate,
  isPaid,
  subscriptionType,
  pageIndex,
  pageSize
}: {
  username?: string,
  role?: string,
  expirationDate?: Date,
  isPaid?: boolean,
  subscriptionType?: string,
  pageIndex?: number,
  pageSize?: number
}) => {
  return userService.searchUsers(
    username,
    role,
    expirationDate,
    isPaid,
    subscriptionType,
    pageIndex,
    pageSize
  );
});

export const getUserById = createAsyncThunk('users/getUserById', async (id: number) => {
  return userService.getUserById(id);
});

export const softDeleteUser = createAsyncThunk('users/softDeleteUser', async (id: number) => {
  await userService.softDeleteUser(id);
  return id;
});

export const upUser = createAsyncThunk('users/upUser', async (userRole: UpdateRole ) => {
  let success = await userService.upUser(userRole.id,userRole.role);

  var RoleUser : UpdateRole = { id:0, role:'' }
  if ( success ) {
    return RoleUser = userRole;
  }
  return  RoleUser;
});

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

interface UpdateRole {
  id: number;
  role: string;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};
// Funciones auxiliares para manejar los estados de las acciones asíncronas
const handlePending = (state: UsersState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: UsersState, action: any) => {
  state.loading = false;
  state.error = action.error.message ?? 'Error al realizar la acción';
};
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    updateUserInState: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchUsers.pending, handlePending)
      .addCase(searchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(searchUsers.rejected, handleRejected)

      .addCase(getUserById.pending, handlePending)
      .addCase(getUserById.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        const user = state.users.find(user => user.id === action.payload.id);
        if (user) {
          Object.assign(user, action.payload);
        } else {
          state.users.push(action.payload);
        }
      })
      .addCase(getUserById.rejected, handleRejected)

      .addCase(softDeleteUser.pending, handlePending)
      .addCase(softDeleteUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(softDeleteUser.rejected, handleRejected)

      .addCase(upUser.pending, handlePending)
      .addCase(upUser.fulfilled, (state, action: PayloadAction<UpdateRole>) => {
        state.loading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index].role = action.payload.role;
        }
      })
      .addCase(upUser.rejected, handleRejected);
  },
});

export const { addUser, removeUser, updateUserInState } = usersSlice.actions;

export default usersSlice.reducer;
