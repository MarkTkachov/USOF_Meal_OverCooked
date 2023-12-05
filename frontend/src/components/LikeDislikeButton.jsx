import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { setPostRating } from "../redux/posts/postsSlice";

export default function LikeDislikeButton({ id, entityType, rating, setRating }) {
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const currentDisplayPost = useSelector(state => state.posts.currentDisplayPost);
    const [status, setStatus] = useState({ isLiked: false, isDislike: false });
    const dispatch = useDispatch();

    

    const fetchLikeStatus = async () => {
        try {
            if (entityType == 'post') {
                let resp = await axios.get(`/api/posts/${id}/isLiked`);
                let res = resp.data;
                setStatus(res);
            }
            else if (entityType == 'comment') {
                let resp = await axios.get(`/api/comments/${id}/isLiked`);
                let res = resp.data;
                setStatus(res);
            }
            else return;
        } catch (error) {
            //console.log(error);
        }
    }

    useEffect(() => {
        fetchLikeStatus();
    }, [])

    const handleChangeLike = (event, newStatus) => {
        setStatus(newStatus);
        //console.log(newStatus);
    };

    const handleClickLikeButton = async () => {
        if (entityType == 'post') {
            if (status.isLiked) {
                try {
                    let resp = await axios.delete(`/api/posts/${id}/like`);
                    fetchLikeStatus();
                    setRating(rating - 1);
                } catch (error) {
                    console.log(error);
                }
            }
            else if (!status.isLiked) {
                try {
                    let resp = await axios.post(`/api/posts/${id}/like`);
                    fetchLikeStatus();
                    setRating(rating + 1);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        if (entityType == 'comment') {
            if (status.isLiked) {
                try {
                    let resp = await axios.delete(`/api/comments/${id}/like`);
                    fetchLikeStatus();
                    setRating(rating - 1);
                } catch (error) {
                    console.log(error);
                }
            }
            else if (!status.isLiked) {
                try {
                    let resp = await axios.post(`/api/comments/${id}/like`);
                    fetchLikeStatus();
                    setRating(rating + 1);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    const handleClickDisikeButton = async () => {
        if (entityType == 'post') {
            if (status.isLiked) {
                try {
                    let resp = await axios.delete(`/api/posts/${id}/like`);
                    fetchLikeStatus();
                    setRating(rating + 1);
                } catch (error) {
                    console.log(error);
                }
            }
            else if (!status.isLiked) {
                try {
                    let resp = await axios.post(`/api/posts/${id}/like`, {dislike: true});
                    fetchLikeStatus();
                    setRating(rating - 1);
                } catch (error) {
                    console.log(error);
                }
            }
        }
        if (entityType == 'comment') {
            if (status.isLiked) {
                try {
                    let resp = await axios.delete(`/api/comments/${id}/like`);
                    fetchLikeStatus();
                    setRating(rating + 1);
                } catch (error) {
                    console.log(error);
                }
            }
            else if (!status.isLiked) {
                try {
                    let resp = await axios.post(`/api/comments/${id}/like`, {dislike: true});
                    fetchLikeStatus();
                    setRating(rating - 1);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }


    if (!authUser) return null;

    return (
        <Box>
            <ToggleButtonGroup
                value={status}
                exclusive
                aria-label="text alignment"
            >
                <ToggleButton color="success" size="small" value={{ isLiked: true, isDislike: false }}
                 selected={status.isLiked && !status.isDislike}
                 onClick={handleClickLikeButton} disabled={status.isLiked && status.isDislike} >
                    <ThumbUpIcon />
                </ToggleButton>
                <ToggleButton color="error"  size="small" value={{ isLiked: true, isDislike: true }} 
                selected={status.isLiked && status.isDislike}
                 onClick={handleClickDisikeButton} disabled={status.isLiked && !status.isDislike}>
                    <ThumbDownIcon />
                </ToggleButton>
            </ToggleButtonGroup>

        </Box>
    );
}
