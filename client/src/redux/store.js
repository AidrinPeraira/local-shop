import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/userSlice'
import categoriesReducer from './features/categoriesSlice'
import cartReducer from './features/cartSlice';
import wishlistReducer from './features/wishlistSlice';

const store = configureStore({
    reducer : {
        user : userReducer,
        categories : categoriesReducer,
        cart: cartReducer,
        wishlist : wishlistReducer
    }
})

export default store