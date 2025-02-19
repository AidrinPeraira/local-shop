import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { registerUser } from "../../api/userApi";

//let the initial state get user form local storage on strt up
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const registerUserAction = createAsyncThunk(
  "user/register",
  async (userData, thunkAPI) => {
    try {
      const response = await registerUser(userData);
      Cookies.set("jwt", response.cookie, { expires: 1 }); //set token in cookie
      localStorage.setItem("user", JSON.stringify(response.data));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, thunkAPI) => {
    try {
      const response = await loginUser(userData);
      Cookies.set("jwt", response.cookie, { expires: 1 }); //set token in cookie
      localStorage.setItem("user", JSON.stringify(response.data)); //??CHECK
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutUser = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const response = await logoutUser(); // Call your API function to logout (optional)
    Cookies.remove("jwt"); // Remove the JWT cookie
    localStorage.removeItem("user"); // Remove user data from localStorage
    return true; // Return a success flag
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Logout failed"
    );
  }
});

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    profileUpdate: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login case
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Register case
      .addCase(registerUserAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUserAction.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.loading = false;
      })
      .addCase(registerUserAction.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      //logout case
      .addCase(logoutUser.fulfilled, (state) => {
        return { ...initialState };
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { profileUpdate } = userSlice.actions;
export default userSlice.reducer;
