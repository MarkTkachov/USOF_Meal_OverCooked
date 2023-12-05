import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import postsReducer from './posts/postsSlice';
import categoriesReducer from './categories/categoriesSlice'

export default configureStore({
    reducer: {
        auth: authReducer,
        posts: postsReducer,
        categories: categoriesReducer,
    },
  })
