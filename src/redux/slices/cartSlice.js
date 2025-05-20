import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart as apiClearCart } from "../../api/cart";

// Fetch cart from server
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const response = await getCart();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error fetching cart");
    }
  }
);

// Add item to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItem",
  async (productData, thunkAPI) => {
    try {
      const response = await addToCart(productData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error adding item to cart");
    }
  }
);

// Update cart item
export const updateItem = createAsyncThunk(
  "cart/updateItem",
  async ({ cartItemId, quantity }, thunkAPI) => {
    try {
      const response = await updateCartItem(cartItemId, quantity);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error updating item");
    }
  }
);

// Remove item from cart
export const removeItem = createAsyncThunk(
  "cart/removeItem",
  async (cartItemId, thunkAPI) => {
    try {
      const response = await removeFromCart(cartItemId);
      return { cartItemId, ...response.data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error removing item");
    }
  }
);

// Clear cart
export const clearCartThunk = createAsyncThunk(
  "cart/clearCart",
  async (_, thunkAPI) => {
    try {
      const response = await apiClearCart();
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error clearing cart");
    }
  }
);

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Add legacy reducers back for compatibility with existing components
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );
      state.totalQuantity++;
      
      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          quantity: newItem.quantity,
          price: newItem.price,
          productName: newItem.productName,
          image: newItem.imgUrl,
          totalPrice: newItem.price,
          size: newItem.size,
        });
      } else {
        existingItem.quantity += newItem.quantity;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) + Number(newItem.price);
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
    },
    increase: (state, action) => {
      const id = action.payload;
      state.totalQuantity += 1;
      const selectedItem = state.cartItems.find((item) => item.id === id);
      selectedItem.quantity += 1;
    },
    decrease: (state, action) => {
      const id = action.payload;
      state.totalQuantity -= 1;
      const selectedItem = state.cartItems.find((item) => item.id === id);
      if (selectedItem.quantity > 1) {
        selectedItem.quantity -= 1;
      }
    },
    calculateTotal: (state) => {
      let totalQuantity = 0;
      let totalAmount = 0;
      state.cartItems.forEach((item) => {
        totalQuantity += item.quantity;
        totalAmount += item.quantity * item.price;
      });
      state.totalAmount = totalAmount;
      state.totalQuantity = totalQuantity;
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items || [];
        state.totalAmount = action.payload.totalAmount;
        state.totalQuantity = action.payload.totalQuantity;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add item
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalQuantity = action.payload.totalQuantity;
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update item
      .addCase(updateItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalQuantity = action.payload.totalQuantity;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Remove item
      .addCase(removeItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.totalQuantity = action.payload.totalQuantity;
      })
      .addCase(removeItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Clear cart
      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        state.totalAmount = 0;
        state.totalQuantity = 0;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Re-export the old actions for backward compatibility
export const cartActions = cartSlice.actions;
export const { clearCart, calculateTotal, increase, decrease, deleteItem } = cartSlice.actions;

export default cartSlice.reducer;
