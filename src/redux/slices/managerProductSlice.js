import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api";
const initialState = {
  products: [],
  isLoading: false,
  isError: false,
  error: null,
  productsPage: [],
  totalPages: 0,
  trendingProducts: [],
  bestSalesProducts: [],
  popularProducts: [],
};

export const fetchAllProduct = createAsyncThunk(
  "managerProduct/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await api.getAllProducts();
      console.log('API Response:', response);
      if (response && response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Fetch products error:', error);
      return thunkAPI.rejectWithValue(error.message || 'Có lỗi xảy ra khi tải danh sách sản phẩm');
    }
  }
);

export const addNewProduct = createAsyncThunk(
  "managerProduct/add",
  async (dataAddProduct, thunkAPI) => {
    try {
      if (!dataAddProduct || !dataAddProduct.data || !dataAddProduct.token) {
        throw new Error('Invalid data format: missing required fields');
      }
      
      const response = await api.addProduct({
        data: dataAddProduct.data,
        token: dataAddProduct.token
      });
      
      if (!response || !response.data) {
        throw new Error('Invalid response from server');
      }
      
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message || 'Có lỗi xảy ra khi thêm sản phẩm');
    }
  }
);

// edit product
export const editProduct = createAsyncThunk(
  "managerProduct/edit",
  async (dataAddProduct, thunkAPI) => {
    const { id, data, token } = dataAddProduct;
    try {
      const response = await api.updateProduct(id, data, token);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// delete
export const deleteProduct = createAsyncThunk(
  "managerProduct/delete",
  async (dataDelete, thunkAPI) => {
    const { id, token } = dataDelete;
    try {
      const response = await api.deleteProduct(id, token);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const managerProductSlice = createSlice({
  name: "managerProductSlice",
  initialState,
  reducers: {
    dataProductsPage: (state, action) => {
      console.log('dataProductsPage action:', action);
      if (action.payload && action.payload.data) {
        state.productsPage = action.payload.data.content;
        state.totalPages = action.payload.data.totalPages;
      } else {
        console.warn('Invalid payload format for dataProductsPage:', action.payload);
        state.productsPage = [];
        state.totalPages = 0;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProduct.fulfilled, (state, action) => {
        console.log('Redux fulfilled action:', action);
        state.isLoading = false;
        state.isError = false;
        if (action.payload && Array.isArray(action.payload)) {
          state.products = action.payload;
          state.trendingProducts = action.payload.filter(
            (item) => item.category === "basketball"
          );
          state.bestSalesProducts = action.payload.filter(
            (item) => item.category === "running"
          );
          state.popularProducts = action.payload.filter(
            (item) => item.category === "lifestyle"
          );
        } else {
          console.warn('Invalid payload format:', action.payload);
          state.products = [];
          state.trendingProducts = [];
          state.bestSalesProducts = [];
          state.popularProducts = [];
        }
      })
      .addCase(fetchAllProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.error = action.payload || 'Có lỗi xảy ra khi tải danh sách sản phẩm';
      })
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.products = [...state.products, action.payload.data];
      })
      .addCase(addNewProduct.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(editProduct.pending, (state) => {})
      .addCase(editProduct.fulfilled, (state, action) => {
        const newData = action.payload.data;
        // all
        const dataIndex = state.products.findIndex(
          (data) => data.id === newData.id
        );
        if (dataIndex >= 0) {
          state.products[dataIndex] = newData;
        }
      })
      .addCase(editProduct.rejected, (state) => {})
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const existingItem = state.products.find(
          (item) => item.id === action.payload
        );
        const itemPage = state.productsPage.find(
          (item) => item.id === action.payload
        );
        if (existingItem) {
          state.products = state.products.filter(
            (item) => item.id !== action.payload
          );
        }
        if (itemPage) {
          state.productsPage = state.productsPage.filter(
            (item) => item.id !== action.payload
          );
        }
      });
  },
});

export default managerProductSlice.reducer;
export const { dataProductsPage } = managerProductSlice.actions;
