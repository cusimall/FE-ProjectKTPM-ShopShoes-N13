import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  createVnPayPayment, 
  getPaymentStatus, 
  createCodPayment, 
  getPaymentMethods 
} from "../../api/payment";

// Get payment methods
export const fetchPaymentMethods = createAsyncThunk(
  "payment/fetchPaymentMethods",
  async (_, thunkAPI) => {
    try {
      const response = await getPaymentMethods();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching payment methods");
    }
  }
);

// Create VNPAY payment
export const createVnpayPayment = createAsyncThunk(
  "payment/createVnpayPayment",
  async (amount, thunkAPI) => {
    try {
      const response = await createVnPayPayment(amount);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error creating VnPay payment");
    }
  }
);

// Create COD payment
export const createCashOnDelivery = createAsyncThunk(
  "payment/createCodPayment",
  async (orderId, thunkAPI) => {
    try {
      const response = await createCodPayment(orderId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error creating COD payment");
    }
  }
);

// Get payment status
export const fetchPaymentStatus = createAsyncThunk(
  "payment/fetchPaymentStatus",
  async (paymentId, thunkAPI) => {
    try {
      const response = await getPaymentStatus(paymentId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching payment status");
    }
  }
);

const initialState = {
  paymentMethods: [],
  currentPayment: null,
  paymentUrl: null,
  paymentStatus: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPaymentUrl: (state) => {
      state.paymentUrl = null;
    },
    clearPaymentStatus: (state) => {
      state.paymentStatus = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch payment methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create VnPay payment
      .addCase(createVnpayPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVnpayPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload.paymentUrl;
        state.currentPayment = action.payload;
      })
      .addCase(createVnpayPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create COD payment
      .addCase(createCashOnDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCashOnDelivery.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(createCashOnDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch payment status
      .addCase(fetchPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = action.payload;
      })
      .addCase(fetchPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentUrl, clearPaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;