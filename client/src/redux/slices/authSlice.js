import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser, registerUser} from "../../api/authService";
import Cookies from 'js-cookie'


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

//create authSlice

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      logout: (state) => {
        // Remove the JWT cookie and user info from localStorage
        Cookies.remove("jwt");
        localStorage.removeItem("user");
        state.user = null;
      },
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
        });
    },
  });

  export const {logout} = authSlice.actions;
  export default authSlice.reducer
