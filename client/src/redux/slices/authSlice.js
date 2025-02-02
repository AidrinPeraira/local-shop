import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser, logoutUser} from "../../api/authService";
import Cookies from 'js-cookie'
import axios from "axios";


const initialState = {
    user : JSON.parse(localStorage.getItem("user")) || null,
    loading : false,
    error : null
}

//handle async api requests

export const login = createAsyncThunk("auth/login", async (userData, thunkAPI) => {
    try {
        
        const response = await loginUser(userData);
        Cookies.set('jwt', response.cookie, {expires: 1}) //set token in cookie
        localStorage.setItem('user', JSON.stringify(response.data)) //??CHECK
        return response

    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const register = createAsyncThunk("auth/register", async (userData, thunkAPI) => {
    try {
      const response = await registerUser(userData);
      Cookies.set('jwt', response.cookie, {expires: 1}) //set token in cookie
      localStorage.setItem('user', JSON.stringify(response.data))
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  });

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await logoutUser(); // Call your API function to logout (optional)
    Cookies.remove("jwt"); // Remove the JWT cookie
    localStorage.removeItem("user"); // Remove user data from localStorage
    return true; // Return a success flag
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed");
  }
});

//create authSlice

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
      builder
        // Login case
        .addCase(login.pending, (state) => { state.loading = true; })
        .addCase(login.fulfilled, (state, action) => {
          state.user = action.payload.data;
          state.loading = false;
        })
        .addCase(login.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })
        
        // Register case
        .addCase(register.pending, (state) => { state.loading = true; })
        .addCase(register.fulfilled, (state, action) => {
          state.user = action.payload.data;
          state.loading = false;
        })
        .addCase(register.rejected, (state, action) => {
          state.error = action.payload;
          state.loading = false;
        })

        //logout case
        .addCase(logout.fulfilled, (state) => {
          return { ...initialState };
        })
        .addCase(logout.rejected, (state, action) => {
          state.error = action.payload;
        })
    },
  });

  // export const {logout} = authSlice.actions;
  export default authSlice.reducer
