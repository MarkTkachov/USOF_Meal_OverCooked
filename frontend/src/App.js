import Login from './pages/Login';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from 'axios';
import MyProfile from './pages/MyProfile';
import Register from './pages/Register';
import EmailConfirmation from './pages/EmailConfirmation';
import PasswordResetForm from './pages/PasswordResetForm';
import AllPosts from './pages/AllPosts';
import PostPage from './pages/PostPage';
import MyPosts from './pages/MyPosts';
import MyFavourites from './pages/MyFavourites';
import CreatePost from './pages/CreatePost';
import Categories from './pages/Categories';
axios.defaults.withCredentials = true;
// eslint-disable-next-line no-undef
axios.defaults.baseURL = process.env.REACT_APP_API_SERVER

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/myFavourites/' element={<MyFavourites />} />
        <Route path='/myPosts/' element={<MyPosts />} />
        <Route path='/posts/' element={<AllPosts />}/>
        <Route path='/posts/new' element={<CreatePost />}/>
        <Route path='/posts/:id' element={<PostPage />}/>
        <Route path='/categories/' element={<Categories />}/>
        <Route path='/register' element={<Register />} />
        <Route path='/email-confirmation/:token' element={<EmailConfirmation />} />
        <Route path='/password-reset/:token' element={<PasswordResetForm />} />
        <Route path="/login" element={<Login />}></Route>
        <Route path="/me" element={<MyProfile />}></Route>
        <Route path="/" element={<AllPosts />}></Route>
        <Route path='*' element={<Navigate to='/me' />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
