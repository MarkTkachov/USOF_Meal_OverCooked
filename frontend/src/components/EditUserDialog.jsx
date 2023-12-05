import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import FancyHeading from "./FancyHeading";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../redux/categories/categoriesSlice";
import { fetchAuthenticatedUser } from "../redux/auth/authSlice";
import MessageToast from "./MessageToast";


export default function EditUserDialog({ openState, closeHandle, currentData }) {
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const { id, login, fullName, role, email } = currentData;
    let [inputs, setInputs] = useState(currentData);
    const dispatch = useDispatch();

    if (!authUser || authUser.role != 'Admin') return null;

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
            if (!inputs.login || inputs.login.trim() == '') return showMessage('Login cannot be empty');
            if (!inputs.fullName || inputs.fullName.trim() == '') return showMessage('Name cannot be empty');
            if (!inputs.email || inputs.email.trim() == '') return showMessage('Email cannot be empty');
            if (!inputs.role || inputs.role.trim() == '') return showMessage('Role invalid');
            
            let reqData = {...inputs};
            delete reqData.password;
            delete reqData.active;
            // eslint-disable-next-line no-undef
            let res = await axios.patch(`/api/users/${id}`, reqData);
            dispatch(fetchAuthenticatedUser());
            closeHandle();
            // setMessage(`Password reset link sent to ${inputs.email}. It will expire in 15 minutes`);

        } catch (err) {
            console.log(err);
            if (err.responce?.status == 404) {
                // setMessage('No user with this email exists');
                showMessage('User not found');
                //closeHandle();
                return;
            }
            showMessage('Error edit user');
            // else setMessage('Error occured during sending email. Please check if email is correct')
            //closeHandle();
        }
    }

    return (
        <Dialog open={openState} onClose={closeHandle}>
        {/* <DialogTitle>Edit User</DialogTitle> */}
        <DialogContent>
          <DialogContentText>
            <FancyHeading variant='h5'>Edit User</FancyHeading>
          </DialogContentText>
          <MessageToast open={toast} onClose={closeMessage} severity={'error'}>{toastMessage}</MessageToast>
          <TextField
            margin="dense"
            label="Login"
            type="text"
            fullWidth
            variant="standard"
            name="login"
            value={inputs.login || ''} 
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            variant="standard"
            name="fullName"
            value={inputs.fullName || ''} 
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            name="email"
            value={inputs.email || ''} 
            onChange={handleChange}
          />
          <Select label='Role' margin="dense" name="role" value={inputs.role || 'User'} onChange={handleChange}>
            <MenuItem selected={role == 'User'} value={'User'}>User</MenuItem>
            <MenuItem selected={role == 'Admin'} value={'Admin'}>Admin</MenuItem>
          </Select>

        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandle}>Cancel</Button>
          <Button onClick={handleSubmit}>Edit User</Button>
        </DialogActions>
      </Dialog>
    );


}
