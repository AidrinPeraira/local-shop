import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userLoginApi, userLogoutApi, userRegApi } from "../../api/userAuthApi";
import Cookies from 'js-cookie'

//first we will create an async thunk midelware
//user 
export const registerUser = createAsyncThunk(
  "user/registerUser", //THIS IS THE NAME GIVEN IN EXTRA REDUCERS
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userRegApi(userData); //this is the aasync api call
      return response.data; //this is the payload given when the dispatch is called
    } catch (error) {
      return rejectWithValue(error.response.data.message);
      /**Instead of throwing an error, rejectWithValue returns the error in the action.payload of the rejected case */
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userLoginApi(userData); //this is the aasync api call
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data; //this is the payload given when the dispatch is called
    } catch (error) {
      return rejectWithValue(error.response.data.message);
      /**Instead of throwing an error, rejectWithValue returns the error in the action.payload of the rejected case */
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await userLogoutApi(); // Call your API function to logout (optional)
      Cookies.remove("jwt"); // Remove the JWT cookie
      localStorage.removeItem("user"); // Remove user data from localStorage
      return true; // Return a success flag
    } catch (error) {
      return rejectWithValue(error.message);
      /**Instead of throwing an error, rejectWithValue returns the error in the action.payload of the rejected case */
    }
  }
);

//admin

export const loginAdmin = createAsyncThunk(
  "user/loginAdmin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userLoginApi(userData); //this is the aasync api call
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data; //this is the payload given when the dispatch is called
    } catch (error) {
      return rejectWithValue(error.response.data.message);
      /**Instead of throwing an error, rejectWithValue returns the error in the action.payload of the rejected case */
    }
  }
);

//now create a slice and set the reducer in the slice.
//the state will have the data field, status field and the eroor feild

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null, //get the stored user from local storage if it exists
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {}, //we have no reducers since we are not using the normal dispatch method
  extraReducers: (builder) => {
    //this is where we add the async thunk reducers. we add reducers for each promise state
    builder

      //register user
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null; //for any previous errors
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
      })

      //login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
      })

      //logout user
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        return {...initialState} // this will remove the old user form the redux store
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default userSlice.reducer; //export the reducer to add a slice in the store
