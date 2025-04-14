import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: JSON.parse(localStorage.getItem("wishlist")) || null,
  count: parseInt(localStorage.getItem("wishlistCount")) || 0,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlistCount: (state, action) => {
      state.count = action.payload;
      localStorage.setItem("wishlistCount", action.payload);
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setWishlistCount } = wishlistSlice.actions;
export default wishlistSlice.reducer;
