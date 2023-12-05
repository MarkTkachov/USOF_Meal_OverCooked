import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import FancyHeading from "./FancyHeading";
import { useDispatch } from "react-redux";
import { fetchAllCategories } from "../redux/categories/categoriesSlice";
import MessageToast from "./MessageToast";


export default function NewCategoryDialog({ openState, closeHandle }) {
    let [inputs, setInputs] = useState({});
    const dispatch = useDispatch();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({ ...inputs, [name]: value }))
    }

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

    const handleSubmit = async () => {
        try {
            if (!inputs.title || inputs.title.trim() == '') return showMessage('Title cannot be empty');
            if (!inputs.description || inputs.description.trim() == '') return showMessage('Description cannot be empty');
            // eslint-disable-next-line no-undef
            let res = await axios.post('/api/categories/', inputs);
            dispatch(fetchAllCategories());
            closeHandle();
            // setMessage(`Password reset link sent to ${inputs.email}. It will expire in 15 minutes`);

        } catch (err) {
            console.log(err);
            showMessage('Error create category');
            // else setMessage('Error occured during sending email. Please check if email is correct')
            //closeHandle();
        }
    }

    return (
        <Dialog open={openState} onClose={closeHandle}>
        {/* <DialogTitle>Create Category</DialogTitle> */}
        <DialogContent>
          <DialogContentText>
            <FancyHeading variant='h5'>Create new Category</FancyHeading>
          </DialogContentText>
          <MessageToast open={toast} onClose={closeMessage} severity={'error'}>{toastMessage}</MessageToast>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            name="title"
            value={inputs.title || ''} 
            onChange={handleChange}
          />
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            type="text"
            multiline
            minRows={3}
            fullWidth
            variant="outlined"
            name="description"
            value={inputs.description || ''} 
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandle}>Cancel</Button>
          <Button onClick={handleSubmit}>Create Category</Button>
        </DialogActions>
      </Dialog>
    );


}
