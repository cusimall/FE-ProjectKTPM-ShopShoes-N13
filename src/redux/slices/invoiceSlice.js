import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createInvoice, getInvoiceById, getUserInvoices, getAllInvoices, updateInvoiceStatus } from "../../api/invoice";

// Create a new invoice
export const createNewInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async (invoiceData, thunkAPI) => {
    try {
      const response = await createInvoice(invoiceData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error creating invoice");
    }
  }
);

// Get invoice by ID
export const fetchInvoiceById = createAsyncThunk(
  "invoice/fetchInvoiceById",
  async (invoiceId, thunkAPI) => {
    try {
      const response = await getInvoiceById(invoiceId);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching invoice");
    }
  }
);

// Get user invoices
export const fetchUserInvoices = createAsyncThunk(
  "invoice/fetchUserInvoices",
  async (_, thunkAPI) => {
    try {
      const response = await getUserInvoices();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching user invoices");
    }
  }
);

// Get all invoices (admin)
export const fetchAllInvoices = createAsyncThunk(
  "invoice/fetchAllInvoices",
  async ({ page = 0, size = 10 }, thunkAPI) => {
    try {
      const response = await getAllInvoices(page, size);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching all invoices");
    }
  }
);

// Update invoice status
export const changeInvoiceStatus = createAsyncThunk(
  "invoice/changeInvoiceStatus",
  async ({ invoiceId, status }, thunkAPI) => {
    try {
      const response = await updateInvoiceStatus(invoiceId, status);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error updating invoice status");
    }
  }
);

const initialState = {
  currentInvoice: null,
  userInvoices: [],
  allInvoices: [],
  totalPages: 0,
  loading: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create invoice
      .addCase(createNewInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(createNewInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get invoice by ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get user invoices
      .addCase(fetchUserInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.userInvoices = action.payload?.data || [];
      })
      .addCase(fetchUserInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Get all invoices
      .addCase(fetchAllInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.allInvoices = action.payload.content;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchAllInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update invoice status
      .addCase(changeInvoiceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeInvoiceStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
        
        // If in the user invoices array, update it there too
        const index = state.userInvoices.findIndex(
          (invoice) => invoice.invoiceId === action.payload.invoiceId
        );
        if (index !== -1) {
          state.userInvoices[index] = action.payload;
        }
        
        // If in the all invoices array, update it there too
        const adminIndex = state.allInvoices.findIndex(
          (invoice) => invoice.invoiceId === action.payload.invoiceId
        );
        if (adminIndex !== -1) {
          state.allInvoices[adminIndex] = action.payload;
        }
      })
      .addCase(changeInvoiceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default invoiceSlice.reducer; 