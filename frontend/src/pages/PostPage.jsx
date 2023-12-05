import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostToDisplay } from "../redux/posts/postsSlice";
import PostFull from "../components/PostFull";
import TopBar from "../components/TopBar";
import { Backdrop, Box, Container } from "@mui/material";
import ContentContainer from "../components/ContentContainer";

export default function PostPage() {
    const { id } = useParams();
    const displayPost = useSelector(state => state.posts.currentDisplayPost);
    const displayPostStatus = useSelector(state => state.posts.currentDisplayPostStatus);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPostToDisplay(id));
    }, []);

    return (
        <div>
            <TopBar />
            {displayPostStatus == 'loaded' ?
                <Container>
                    <Box marginTop={'1em'}>
                        <PostFull post={displayPost} />
                    </Box>

                </Container> : null}


        </div>

    );


}
