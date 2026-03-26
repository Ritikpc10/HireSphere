import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    token: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
  },
});

// Export the actions
export const { setLoading, setUser, setToken, clearAuth } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;

// Export the authSlice if needed
export const authSliceReducer = authSlice.reducer;
