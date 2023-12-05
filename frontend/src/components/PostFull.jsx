import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import AuthorBadge from "./AuthorBadge";
import CategoryChip from "./CategoryChip";
import Comment from "./Comment";
import DateSmall from "./DateSmall";
import RatingBadge from "./RatingBadge";
import FancyHeading from "./FancyHeading";
import NewCommentForm from "./NewCommentForm";
import InactiveChip from "./InactiveChip";
import { useDispatch, useSelector } from "react-redux";
import EditPostDialog from "./EditPostDialog";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LikeDislikeButton from "./LikeDislikeButton";
import FavouriteButton from "./FavouriteButton";
import { clearPostsCache, fetchReloadPostToDisplay, fetchReloadPostToDisplayComments } from "../redux/posts/postsSlice";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw'
import RefreshButton from "./RefreshButton";

export default function PostFull({ post }) {
    if (!post) return null;
    let { id, title, content, publishDate, status, author, categories, comments, type } = post;
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const [editDialog, setEditDialog] = useState(false);
    const [rating, setRating] = useState(post.rating);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleOpenEditDialog = () => {
        setEditDialog(true);
    }

    const handleCloseEditDialog = () => {
        setEditDialog(false);
    }

    const handleDeletePost = async () => {
        if (!authUser || (authUser.role != 'Admin' && authUser.id != id)) return;
        if (confirm('Are you sure you want to delete this Post?')) {
            try {
                let resp = await axios.delete(`/api/posts/${id}`);
                dispatch(clearPostsCache());
                navigate('/');
            } catch (err) {
                console.log(err);
                alert('You cannot delete this post');
            }
        }
    }

    return (
        <Box>
            <Paper elevation={2} sx={{ padding: '1em' }}>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={3}>
                        <Typography variant="h3">{title}</Typography>
                        {status == 'inactive' ? <InactiveChip /> : null}
                        <FavouriteButton postId={id} />
                        <RefreshButton onClick={() => {dispatch(fetchReloadPostToDisplay())}} />
                    </Stack>
                    <Stack spacing={1}>
                        {authUser && (authUser.role == 'Admin' || authUser.id == author.id)
                            ? <>
                                <Button variant="contained" onClick={handleOpenEditDialog}>Edit Post</Button>
                                <Button variant="contained" color="error" onClick={handleDeletePost}>Delete Post</Button>
                                <EditPostDialog openState={editDialog} closeHandle={handleCloseEditDialog} currentData={post} />
                            </> : null}

                    </Stack>

                </Stack>

                <DateSmall label={'Published'} align="left" dateStr={publishDate} />

                <AuthorBadge author={author} />
                <Box margin={'0.5em'}>
                    <Stack direction={'row'} spacing={2}>
                        <RatingBadge rating={rating} />
                        <LikeDislikeButton id={id} entityType={'post'} rating={rating} setRating={setRating} />
                    </Stack>

                </Box>
                <Box>
                    <Stack direction={'row'} flexWrap={'wrap'} spacing={2}>
                        {categories.map(cat => <CategoryChip key={cat.id} category={cat} />)}
                    </Stack>
                </Box>
                <Paper elevation={4} sx={{ margin: '0.5em' }}>
                    <Box padding={'1em'}>
                        {type == 'plain' ? <Typography whiteSpace={'pre-wrap'}>{content}</Typography> 
                        : type == 'markdown' ? <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</Markdown>
                        : null}
                        

                    </Box>
                </Paper>



            </Paper>

            <Box>
                <span>
                <FancyHeading variant='h4'>Comments <RefreshButton onClick={() => {dispatch(fetchReloadPostToDisplayComments())}} /></FancyHeading>
                </span>
                
                {comments.map(com => <Comment key={com.id} comment={com} />)}
                <NewCommentForm postId={id} />
            </Box>


        </Box>
    );
}
