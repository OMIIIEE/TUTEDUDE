import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/auth"; 

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null, 
  loading: false,
  error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axios.post("/login", credentials); 
      localStorage.setItem("token", response.data.token); 
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : "An error occurred"
      );
    }
  }
);


export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post("/register", userData); 
      localStorage.setItem("token", response.data.token); 
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response ? error.response.data.message : "An unexpected error occurred during registration"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Action to logout user and clear localStorage
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      // Login User - Pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Login User - Fulfilled
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      // Login User - Rejected
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register User - Pending
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Register User - Fulfilled
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      // Register User - Rejected
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
