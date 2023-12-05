import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";


export default function PasswordResetDialog({ openState, closeHandle }) {
    let [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({ ...inputs, [name]: value }))
    }

    const handleSubmit = async () => {
        try {
            // eslint-disable-next-line no-undef
            inputs.email_redirect_base = process.env.REACT_APP_FRONT_SERVER;
            let res = await axios.post('/api/auth/password-reset', inputs);
            closeHandle();
            // setMessage(`Password reset link sent to ${inputs.email}. It will expire in 15 minutes`);

        } catch (err) {
            console.log(err);
            if (err.responce?.status == 404) {
                // setMessage('No user with this email exists');
            }
            // else setMessage('Error occured during sending email. Please check if email is correct')
            //closeHandle();
        }
    }

    return (
        <Dialog open={openState} onClose={closeHandle}>
        <DialogTitle>Reset password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To change your password, please enter your email address here. We
            will send a link for changing the password, it will expire in 15 minutes.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
            name="email"
            value={inputs.email || ''} 
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandle}>Cancel</Button>
          <Button onClick={handleSubmit}>Send email</Button>
        </DialogActions>
      </Dialog>
    );


}
