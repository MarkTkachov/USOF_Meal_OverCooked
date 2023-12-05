import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAuthenticatedUser } from "../redux/auth/authSlice";
import { fetchMyPosts } from "../redux/posts/postsSlice";
import TopBar from "../components/TopBar";
import { Container, Stack, Typography } from "@mui/material";
import PostPreviewList from "../components/PostPreviewList";
import RefreshButton from "../components/RefreshButton";


export default function MyPosts() {
    //const authUser = useSelector((state) => state.auth.authenticatedUser);
    const authStatus = useSelector((state) => state.auth.status);
    const isLoaded = useSelector((state) => state.auth.isLoaded);
    const myPosts = useSelector((state) => state.posts.myPosts);
    const myPostsStatus = useSelector((state) => state.posts.myPostsStatus);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoaded && authStatus != 'loading') {
            dispatch(fetchAuthenticatedUser());
        }
        else {
            if (myPostsStatus == 'none' || myPostsStatus == 'error') {
                dispatch(fetchMyPosts());
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
                    <Typography align="center" variant="h3" marginTop={'10px'} fontFamily={'Kaushan Script'}>My Posts
                        <RefreshButton onClick={() => {
                                    dispatch(fetchMyPosts());
                        }} /></Typography>
                </span>

                <PostPreviewList posts={myPosts} />
            </Container>
        </div>
    );
}
