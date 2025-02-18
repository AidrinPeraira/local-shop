import {configureStore} from '@reduxjs/toolkit';

const store = configureStore({
    reducer : {
        user : userReducer,
        // cart : cartReducer,
        // saved : savedReducer
    }
})

export default store