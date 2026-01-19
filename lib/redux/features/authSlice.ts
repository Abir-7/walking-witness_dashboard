import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the user object
interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  avatar?: string | null;
}

// Define a type for the slice state
interface AuthState {
  token: string | null;
  isLoading: boolean;
  user: User | null;
}

// Define the initial state
const initialState: AuthState = {
  token: null,
  isLoading: false,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isLoading = false;
    },
  },
});

// Export actions
export const { setLoading, setToken, setUser, clearAuth } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selector example
export const selectAuth = (state: RootState) => state.auth;
export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
