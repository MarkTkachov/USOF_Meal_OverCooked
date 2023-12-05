import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import AuthorBadge from "./AuthorBadge";
import DateSmall from "./DateSmall";
import RatingBadge from "./RatingBadge";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditCommentDialog from "./EditCommentDialog";
import axios from "axios";
import { fetchReloadPostToDisplay } from "../redux/posts/postsSlice";
import LikeDislikeButton from "./LikeDislikeButton";

export default function Comment({ comment }) {
    if (!comment) return null;
    let { id, publishDate, content, author } = comment;
    const authUser = useSelector((state) => state.auth.authenticatedUser);
    const [rating, setRating] = useState(comment.rating);
    const dispatch = useDispatch();

    const [editDialog, setEditDialog] = useState(false);

    const handleOpenEditDialog = () => {
        setEditDialog(true);
    }

    const handleCloseEditDialog = () => {
        setEditDialog(false);
    }

    const handleDeleteComment = async () => {
        if (!authUser || (authUser.role != 'Admin' && authUser.id != author.id)) return;
        if (confirm('Are you sure you want to delete this Comment?')) {
            try {
                let resp = await axios.delete(`/api/comments/${id}`);
                dispatch(fetchReloadPostToDisplay());
            } catch (err) {
                console.log(err);
                alert('You cannot delete this comment');
            }
        }
    }

    return (
        <Paper elevation={3} sx={{ marginTop: '0.5em' }}>
            <Box padding={'0.5em'}>
                <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap'}>
                    <AuthorBadge author={author} elevation={3}> </AuthorBadge>
                    <Stack>
                        {authUser && authUser.id == author?.id ?
                            <>
                                <Button variant="contained" onClick={handleOpenEditDialog}>Edit Comment</Button>

                                <EditCommentDialog openState={editDialog} closeHandle={handleCloseEditDialog} currentData={comment} />
                            </> : null}
                        {authUser && (authUser.id == author?.id || authUser.role == 'Admin') ?
                            <Button variant="contained" color="error" onClick={handleDeleteComment}>Delete Comment</Button>
                            : null}
                    </Stack>
                </Stack>

                <DateSmall dateStr={publishDate} align="left" />
                <Stack direction={'row'} spacing={2}>
                    {rating != null && rating != undefined ? <RatingBadge rating={rating} /> : null}
                    <LikeDislikeButton id={id} entityType={'comment'} rating={rating} setRating={setRating} />
                </Stack>

                <Paper elevation={0}>
                    <Box padding={'0.5em'}>
                        <Typography>{content}</Typography>
                    </Box>


                </Paper>
            </Box>


        </Paper>
    );
}
