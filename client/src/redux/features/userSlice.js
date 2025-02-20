import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userRegApi } from "../../api/userAuthApi";


//first we will create an async thunk midelware
export const registerUser = createAsyncThunk(
    "user/register",
    async (userData, {rejectWithValue}) => {
        try {
            const response = userRegApi(userData) //this is the aasync api call
            return response.data //this is the payload given when the dispatch is called
        } catch (error) {
            return rejectWithValue(error.response.data.message)
            /**Instead of throwing an error, rejectWithValue returns the error in the action.payload of the rejected case */
        }
    }
)

//now create a slice and set the reducer in the slice.
//the state will have the data field, status field and the eroor feild

const initialState = {
    user : JSON.parse(localStorage.getItem("user")) || null, //get the stored user from local storage if it exists
    loading : false,
    error : null
}

const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {}, //we have no reducers since we are not using the normal dispatch method
    extraReducers : (builder) => { //this is where we add the async thunk reducers. we add reducers for each promise state
        builder
            .addCase(registerUser.pending, (state)=>{
                state.loading = true,
                state.error = null //for any previous errors
            })
            .addCase(registerUser.fulfilled, (state, action)=>{
                state.loading = false,
                state.user = action.payload
            })
            .addCase(registerUser.rejected, (state, action)=>{
                state.loading = false,
                state.error = action.payload.data
            })
    }
})

export default  userSlice.reducer //export the reducer to add a slice in the store