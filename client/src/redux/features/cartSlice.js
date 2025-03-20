import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || null,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
      setCart: (state, action) => {
      state.cart = action.payload;
      state.loading = false;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(action.payload));
    },
    clearCart: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('cart');
    }
  }
});

export const { setCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;