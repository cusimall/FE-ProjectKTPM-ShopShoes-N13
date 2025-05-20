import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../../api/user";

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (page, { rejectWithValue }) => {
    try {
      const response = await api.fetchAllUser(page);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    totalPages: 0,
    loading: false,
    error: null
  },
  reducers: {
    allUsers: (state, action) => {
      console.log("Redux action payload:", action.payload); // Log payload
      if (action.payload?.users) {
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
      }
    },
    editUser: (state, action) => {
      if (action.payload?.data) {
        const newData = action.payload.data;
        const dataIndex = state.users.findIndex((data) => data.id === newData.id);
        if (dataIndex >= 0) {
          state.users[dataIndex] = newData;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.users) {
          state.users = action.payload.users;
          state.totalPages = action.payload.totalPages;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Có lỗi xảy ra khi tải dữ liệu";
      });
  },
});

export const { allUsers, editUser } = userSlice.actions;
export default userSlice.reducer;
