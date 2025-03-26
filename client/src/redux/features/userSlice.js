import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { adminLoginApi, adminLogoutApi, googleAuthApi, sellerLoginApi, sellerLogoutApi, sellerRegApi, userLoginApi, userLogoutApi, userRegApi } from "../../api/userAuthApi";
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
      //this why we cam directly show the error in the componenct'
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userLoginApi(userData); 
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
      
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await userLogoutApi();
      Cookies.remove("jwt"); 
      localStorage.removeItem("user"); 
      return true; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//google auth login 
export const googleAuthUser = createAsyncThunk(
  "user/googleAuthUser",
  async (code, { rejectWithValue }) => {
    try {
      const response = await googleAuthApi(code);
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

//admin
export const loginAdmin = createAsyncThunk(
  "user/loginAdmin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await adminLoginApi(userData); 
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'user/logoutAdmin',
  async (_, {rejectWithValue}) => {
    try {
      const response = await adminLogoutApi();
      Cookies.remove("jwt"); 
      localStorage.removeItem("user")
      return true
    } catch (error) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

//seller
export const registerSeller = createAsyncThunk(
  "seller/registerSeller", 
  async (userData, { rejectWithValue }) => {
    try {
      const response = await sellerRegApi(userData); 
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginSeller = createAsyncThunk(
  "user/loginSeller",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await sellerLoginApi(userData); 
      localStorage.setItem("user", JSON.stringify(response.data));
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const logoutSeller = createAsyncThunk(
  'user/logoutSeller',
  async (_, {rejectWithValue}) => {
    try {
      const response = await sellerLogoutApi();
      localStorage.removeItem("user")      
      Cookies.remove("jwt"); 
      return true
    } catch (error) {
      return rejectWithValue(error.response.data.message)
    }
  }
)

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
  reducers: {
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  },
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

      //user google login
      .addCase(googleAuthUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuthUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(googleAuthUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //logout user
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        return {
          user: null, 
          loading: false,
          error: null,
        } 
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //login admin
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
      })

      //logout admin
      .addCase(logoutAdmin.pending, (state)=>{
        state.loading = true;
        state.error = null
      })
      .addCase(logoutAdmin.fulfilled, (state)=>{
        return {
          user: null, 
          loading: false,
          error: null,
        } 
      })
      .addCase(logoutAdmin.rejected, (state, action)=>{
        state.loading = false;
        state.error = action.payload;
      })

      //register seller
      .addCase(registerSeller.pending, (state) => {
        state.loading = true;
        state.error = null; //for any previous errors
      })
      .addCase(registerSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
      })

      //loginseller
      .addCase(loginSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginSeller.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.data;
      })

      //logout seller
      .addCase(logoutSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutSeller.fulfilled, (state, action) => {
        return {
          user: null, 
          loading: false,
          error: null,
        } 
      })
      .addCase(logoutSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

// Export the action
export const { updateUserProfile } = userSlice.actions;

export default userSlice.reducer; //export the reducer to add a slice in the store
