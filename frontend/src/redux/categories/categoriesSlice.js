import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const categoriesSlice = createSlice({
    name:'categories',
    initialState:{
        categories:[],
        status: 'none',
        error: null
    },
    reducers:{},
    extraReducers(builder) {
        builder.addCase(fetchAllCategories.pending, (state, action) => {
            state.status = 'loading'
        })
        .addCase(fetchAllCategories.fulfilled, (state, action) => {
            state.status = 'loaded'
            state.categories = action.payload;
        })
        .addCase(fetchAllCategories.rejected, (state, action) => {
            state.status = 'error'
            state.error = action.error.code
            state.categories = []
        })
        
    }
});

export const fetchAllCategories = createAsyncThunk('categories/all', async () => {
    const resp = await axios.get('/api/categories/')
    return resp.data.categories;
});



export default categoriesSlice.reducer;
