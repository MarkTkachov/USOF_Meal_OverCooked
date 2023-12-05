import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import FancyHeading from "./FancyHeading";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../redux/categories/categoriesSlice";
import { fetchAuthenticatedUser } from "../redux/auth/authSlice";
import { fetchPostToDisplay, fetchReloadPostToDisplay } from "../redux/posts/postsSlice";
import MessageToast from "./MessageToast";


export default function EditCommentDialog({ openState, closeHandle, currentData }) {
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const { id, content, author } = currentData;
    let [inputs, setInputs] = useState(currentData);
    const dispatch = useDispatch();

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

    if (!authUser || authUser.id != author?.id) return null;

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({ ...inputs, [name]: value }))
    }

    const handleSubmit = async () => {
        try {
            if (!inputs.content || inputs.content.trim() == '') return showMessage('Content can not be empty');
            
            
            let reqData = {content: inputs.content};
            // eslint-disable-next-line no-undef
            let res = await axios.patch(`/api/comments/${id}`, reqData);
            dispatch(fetchReloadPostToDisplay());
            closeHandle();
            // setMessage(`Password reset link sent to ${inputs.email}. It will expire in 15 minutes`);

        } catch (err) {
            console.log(err);
            if (err.responce?.status == 404) {
                showMessage('Comment not found');
                //closeHandle();
                return;
            }
            showMessage('Error editing comment')
            // else setMessage('Error occured during sending email. Please check if email is correct')
            //closeHandle();
        }
    }

    return (
        <Dialog open={openState} onClose={closeHandle}>
        {/* <DialogTitle>Edit User</DialogTitle> */}
        <DialogContent>
          <DialogContentText>
            <FancyHeading variant='h5'>Edit Comment</FancyHeading>
          </DialogContentText>
          <MessageToast open={toast} onClose={closeMessage} severity={'error'}>{toastMessage}</MessageToast>
          <TextField
            margin="dense"
            label="Content"
            type="text"
            fullWidth
            multiline
            minRows={3}
            variant="outlined"
            name="content"
            value={inputs.content || ''} 
            onChange={handleChange}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandle}>Cancel</Button>
          <Button onClick={handleSubmit}>Edit Comment</Button>
        </DialogActions>
      </Dialog>
    );


}
