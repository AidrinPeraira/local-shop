import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getActiveCategoriesAPI } from "../../api/categoryApi";



export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, {rejectWithValue}) => {
        try {
            const response = await getActiveCategoriesAPI()
            localStorage.setItem('categories', JSON.stringify(response.data));
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data.message)
        }
    }
)

const initialState = {
    categories : JSON.parse(localStorage.getItem("categories")) || [],
    loading : false,
    error : null
}

const categoriesSlice = createSlice({
    name : 'categories',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchCategories.pending, state => {
                state.loading = true,
                state.error = null
            })
            .addCase(fetchCategories.fulfilled, (state, action)=>{
                state.loading = false,
                state.categories = action.payload
            })
            .addCase(fetchCategories.rejected, (state, action)=>{
                state.loading = false,
                state.error = action.payload.data
            })
    }
})

export default categoriesSlice.reducer