import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.js'

const store = configureStore({
    reducer : {
        user : userReducer,
        // cart : cartReducer,
        // saved : savedReducer
    }
})

export  {store}