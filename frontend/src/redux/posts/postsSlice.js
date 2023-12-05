import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const postsSlice = createSlice({
    name:'posts',
    initialState: {
        myPosts: [],
        favouritePosts: [],
        search: {
            posts: [],
            params: {
                sort: 'rating',
                page: 1,
                maxPages: 1,
                categories: [],
                showInactive: false,
                minDate: null,
                maxDate: null
            }
        },
        currentDisplayPost: null,
        currentDisplayPostStatus: 'none',
        error: null,
        myPostsStatus: 'none',
        favouritePostsStatus:'none',
        searchStatus: 'none'
    },
    reducers:{
        setSearchParams: (state, action) => {
            state.search.params = {...state.search.params, ...action.payload}
        },
        clearPostsCache: (state, action) => {
            state.myPosts = null;
            state.favouritePosts = null;
            state.myPostsStatus = 'none';
            state.favouritePostsStatus = 'none';
        },
        setPostRating: (state, action) => {
            state.currentDisplayPost.rating = action.payload;
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchMyPosts.pending, (state, action) => {
            state.myPostsStatus = 'loading'
        })
        .addCase(fetchMyPosts.fulfilled, (state, action) => {
            state.myPostsStatus = 'loaded'
            state.myPosts = action.payload.myPosts;
        })
        .addCase(fetchMyPosts.rejected, (state, action) => {
            state.myPostsStatus = 'error'
            state.error = action.error.code
            state.myPosts = []
        })
        .addCase(fetchFavouritePosts.pending, (state, action) => {
            state.favouritePostsStatus = 'loading'
        })
        .addCase(fetchFavouritePosts.fulfilled, (state, action) => {
            state.favouritePostsStatus = 'loaded'
            state.favouritePosts = action.payload.favouritePosts;
        })
        .addCase(fetchFavouritePosts.rejected, (state, action) => {
            state.favouritePostsStatus = 'error'
            state.error = action.error.code
            state.favouritePosts = []
        })
        .addCase(fetchSearchPosts.pending, (state, action) => {
            state.searchStatus = 'loading'
        })
        .addCase(fetchSearchPosts.fulfilled, (state, action) => {
            state.searchStatus = 'loaded'
            state.search.posts = action.payload.search.posts;
            state.search.params = action.payload.search.params;
        })
        .addCase(fetchSearchPosts.rejected, (state, action) => {
            state.searchStatus = 'error'
            state.error = action.error.code
            state.search.posts = []
        })
        .addCase(fetchPostToDisplay.pending, (state, action) => {
            state.currentDisplayPostStatus = 'loading'
        })
        .addCase(fetchPostToDisplay.fulfilled, (state, action) => {
            state.currentDisplayPostStatus = 'loaded'
            state.currentDisplayPost = action.payload;
        })
        .addCase(fetchPostToDisplay.rejected, (state, action) => {
            state.currentDisplayPostStatus = 'error'
            state.error = action.error.code
            state.currentDisplayPost = null
        })
        .addCase(fetchReloadPostToDisplayComments.fulfilled, (state, action) => {
            
            state.currentDisplayPost.comments = action.payload.comments;
        })
    }
});

export const fetchMyPosts = createAsyncThunk('posts/myPosts', async () => {
    const resp = await axios.get('/api/users/me/posts');
    return { myPosts: resp.data.posts }
});

export const fetchFavouritePosts = createAsyncThunk('posts/favouritePosts', async () => {
    const resp = await axios.get('/api/users/me/favourites');
    return { favouritePosts: resp.data.posts }
});

export const fetchSearchPosts = createAsyncThunk('posts/searchPosts', async (params) => {
    const resp = await axios.get('/api/posts/', { params });
    return { 
        search:{
            posts: resp.data.posts,
            params: {
                ...params,
                maxPages: resp.data.pages
            }
        },
        
    }
});

export const fetchPostToDisplay = createAsyncThunk('posts/displayPost', async (id) => {
    const resp = await axios.get(`/api/posts/${id}`);
    return resp.data;
});

export const fetchReloadPostToDisplay = createAsyncThunk('posts/displayPostReload', async (id, thunkAPI) => {
    id = thunkAPI.getState().posts?.currentDisplayPost?.id;
    if (!id) return null;
    thunkAPI.dispatch(fetchPostToDisplay(id));
    return null;
});

export const fetchReloadPostToDisplayComments = createAsyncThunk('posts/displayPostComments', async (id, thunkAPI) => {
    id = thunkAPI.getState().posts?.currentDisplayPost?.id;
    if (!id) return null;
    const resp = await axios.get(`/api/posts/${id}/comments`);
    return resp.data;
});

export const { setSearchParams, clearPostsCache, setPostRating } = postsSlice.actions


export default postsSlice.reducer
