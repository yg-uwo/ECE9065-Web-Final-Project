import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, userId: null, role: null,token:null },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.role = action.payload.role;
      state.token = action.payload.token
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.role = null;
      state.token = null
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;