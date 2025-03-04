import {configureStore} from '@reduxjs/toolkit';
import userReducer from './features/userSlice'
import categoriesReducer from './features/categoriesSlice'


const store = configureStore({
    reducer : {
        user : userReducer,
        categories : categoriesReducer
    }
})

export default store