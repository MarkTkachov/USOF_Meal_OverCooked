import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAuthenticatedUser } from "../redux/auth/authSlice";
import { fetchFavouritePosts, fetchMyPosts } from "../redux/posts/postsSlice";
import TopBar from "../components/TopBar";
import { Container, Stack, Typography } from "@mui/material";
import PostPreviewList from "../components/PostPreviewList";
import RefreshButton from "../components/RefreshButton";


export default function MyFavourites() {
    //const authUser = useSelector((state) => state.auth.authenticatedUser);
    const authStatus = useSelector((state) => state.auth.status);
    const isLoaded = useSelector((state) => state.auth.isLoaded);
    const favouritePosts = useSelector((state) => state.posts.favouritePosts);
    const favouritePostsStatus = useSelector((state) => state.posts.favouritePostsStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoaded && authStatus != 'loading') {
            dispatch(fetchAuthenticatedUser());
        }
        else {
            if (favouritePostsStatus == 'none' || favouritePostsStatus == 'error') {
                dispatch(fetchFavouritePosts());
            }
        }
        
    }, [isLoaded]);

    if (authStatus == 'logged out') {
        navigate('/login')
    }
    

    return (
        <div>
            <TopBar />
            <Container>
                <span>
                <Typography align="center" variant="h3" marginTop={'10px'} fontFamily={'Kaushan Script'}>My Favourites
            <RefreshButton onClick={() => {dispatch(fetchFavouritePosts())}} /></Typography>
                </span>
            
                <PostPreviewList posts={favouritePosts} />
            </Container>
        </div>
    );
}
