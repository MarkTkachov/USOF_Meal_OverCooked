import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import AuthUserBadge from "./AuthUserBadge";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import axios from "axios";
import { fetchPostToDisplay, fetchReloadPostToDisplayComments } from "../redux/posts/postsSlice";
import MessageToast from "./MessageToast";


export default function NewCommentForm({ postId }) {
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const dispatch = useDispatch();
    let [inputs, setInputs] = useState({});

    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showMessage = (message) => {
        setToastMessage(message);
        setToast(true);
    }

    const closeMessage = () => {
        setToast(false);
    }
    //<MessageToast open={toast} onClose={closeMessage} severity={'error'}>{toastMessage}</MessageToast>

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({ ...inputs, [name]: value }))
    }

    const handleSubmit = async () => {
        try {
            if (!postId) return;
            if (!inputs.content || inputs.content.trim() == '') return showMessage('Content cannot be empty');
            let resp = await axios.post(`/api/posts/${postId}/comment`, inputs);
            dispatch(fetchReloadPostToDisplayComments());
        } catch (error) {
            console.log(error);
            showMessage('Error sending comment ' + error.response.code);
        }
    }

    if (!authUser) return null;
    if (!postId) throw 'NewCommentForm component must have a prop "postId"';
    return (
        <Box margin={'auto'} marginTop={'1em'}>
            <MessageToast open={toast} onClose={closeMessage} severity={'error'}>{toastMessage}</MessageToast>
            <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'flex-start'} spacing={2} >
                <Typography>New Comment: </Typography>
            <TextField multiline placeholder="Your comment" fullWidth minRows={3} name="content" value={inputs.content || ''} onChange={handleChange}/>
            <Button type="submit" color="success" variant="contained" onClick={handleSubmit}>Send Comment</Button>
            </Stack>
            
            
        </Box>
    );
}
