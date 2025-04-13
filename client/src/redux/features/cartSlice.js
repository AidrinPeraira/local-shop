import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: JSON.parse(localStorage.getItem('cart')) || null,
  count : 0,
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
    },
    setCartCount: (state, action) => {
      state.count = action.payload;
      state.loading = false;
      state.error = null;
    },
  }
});

export const { setCart, clearCart, setCartCount } = cartSlice.actions;
export default cartSlice.reducer;