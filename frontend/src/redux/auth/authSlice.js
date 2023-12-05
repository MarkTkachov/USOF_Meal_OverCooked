import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';


export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authenticatedUser: null,
    status: 'none',
    isLoaded: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.authenticatedUser = action.payload
    },
    logout: (state, action) => {
      axios.post('/api/auth/logout').then(()=> {}).catch(() => {});
      state.authenticatedUser = null;
      state.status = 'logged out';
      state.isLoaded = false;
    },
    
  },
  extraReducers(builder) {
    builder.addCase(fetchAuthenticatedUser.pending, (state, action) => {
        state.status = 'loading';
        //state.isLoaded = false;
    })
    .addCase(fetchAuthenticatedUser.fulfilled, (state, action) => {
        state.authenticatedUser = action.payload.authenticatedUser;
        state.status = 'logged in';
        state.isLoaded = true;
    })
    .addCase(fetchAuthenticatedUser.rejected, (state, action) => {
        state.authenticatedUser = null;
        state.status = 'logged out';
        state.error = action.error.code;
        state.isLoaded = false;
    })
  }
})

export const fetchAuthenticatedUser = createAsyncThunk('auth/fetchMe', async () => {
    const resp = await axios.get('/api/users/me');
    return { authenticatedUser: resp.data }
})

// Action creators are generated for each case reducer function
export const { setUser, logout } = authSlice.actions

export default authSlice.reducer
