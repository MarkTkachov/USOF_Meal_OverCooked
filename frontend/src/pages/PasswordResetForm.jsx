import { Stack, TextField, Button, Container, Paper, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LogoTitle from "../components/LogoTitle";
import MessageToast from "../components/MessageToast";

export default function PasswordResetForm() {
    let [inputs, setInputs] = useState({new_password:'', new_password_confirm: ''});
    let [message, setMessage] = useState('');
    let [toastOpen, setToastOpen] = useState(false);
    let { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (inputs.new_password.trim() != inputs.new_password_confirm.trim() || inputs.new_password.trim().length == 0) {
            setMessage('Passwords do not match')
            setToastOpen(true);
            return;
        }
        try {
            let res = await axios.post('/api/auth/password-reset/' + token, inputs);
            navigate('/login');
        } catch (err) {
            //console.log(err);
            setMessage('Token expired');
            setToastOpen(true);
        }
        
    }

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({ ...inputs, [name]: value }))
    }

    const paperStyle = {
        padding: 20,
        margin: 'auto',
    };

    const inputStyle = {
        marginTop: '1em'
    }

    const btnStyle = {
        margin: '8px 0',
        backgroundColor:'orange',
        color: 'black'
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastOpen(false);
    };
    return (
    <div>
        <Stack direction={'column'} justifyContent="center" alignItems="center" height={'100vh'}>
                <Container maxWidth='sm'>
                    <form method="post" onSubmit={handleSubmit}>
                        <Paper elevation={10} style={paperStyle}>
                            <Grid align="center">
                                <LogoTitle text="Reset Password"/>
                            </Grid>
                            <TextField type="password" label="New password" placeholder="Enter new password" fullWidth required 
                            style={inputStyle} name="new_password" value={inputs.new_password || ''} onChange={handleChange}/>
                            <TextField label="Password Confirm" placeholder="Confirm password" type="password" 
                            fullWidth required  style={inputStyle} name="new_password_confirm" value={inputs.new_password_confirm || ''}  onChange={handleChange} />
                            <Button type="submit" color="primary" variant="contained" style={btnStyle} fullWidth>
                                Submit
                            </Button>
                        </Paper>
                    </form>
                </Container>
                <MessageToast open={toastOpen} onClose={handleClose} severity={'error'}><Typography variant="h5">{message}</Typography></MessageToast>
            </Stack>
    </div>
    );
}
