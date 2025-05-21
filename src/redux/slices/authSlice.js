import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api";

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (data, thunkAPI) => {
    try {
      const response = await api.signIn(data);
      console.log('SignIn response:', response.data);
      return response.data;
    } catch (error) {
      console.error('SignIn error:', error);
      throw error;
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (data, thunkAPI) => {
    try {
      const response = await api.signUp(data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const logOutAuth = createAsyncThunk(
  "auth/logOut",
  async (_, thunkAPI) => {
    try {
      const response = await api.logOut();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: null,
    loading: false,
    error: null
  },
  reducers: {
    logOut: (state) => {
      state.currentUser = null;
      state.error = null;
    },
    editProfile: (state, action) => {
      state.currentUser = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logOutAuth.fulfilled, (state) => {
        state.currentUser = null;
        state.error = null;
      });
  },
});
export const { logOut, editProfile } = authSlice.actions;
export default authSlice.reducer;
