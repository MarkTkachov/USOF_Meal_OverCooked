import { Button, Container, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoTitle from "../components/LogoTitle";
import InputFileUpload from "../components/InputFileUpload";
import DoneIcon from '@mui/icons-material/Done';
import MessageToast from "../components/MessageToast";

export default function Register() {
    let [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    let [addedFile, setAddedFile] = useState(false);
    let [message, setMessage] = useState('');
    let [toastOpen, setToastOpen] = useState(false);

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({ ...inputs, [name]: value }))
    }

    const handlePfpChange = (event) => {
        setAddedFile(true);
    }



    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastOpen(false);
    };

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            if (inputs.password.trim() != inputs.password_confirm.trim()) {
                setMessage("Passwords do not match")
                setToastOpen(true);
                return;
            }
            // eslint-disable-next-line no-undef
            inputs.email_redirect_base = process.env.REACT_APP_FRONT_SERVER;
            let formData = new FormData()
            for (const key in inputs) {
                if (Object.hasOwnProperty.call(inputs, key)) {
                    const value = inputs[key];
                    formData.append(key, value);
                }
            }
            let profile_picture = document.getElementById('registrationProfilePicture');
            if (profile_picture && profile_picture.files[0]) {
                formData.append("profile_picture", profile_picture.files[0]);
            }
            let res = await axios.post('/api/auth/register', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });
            navigate('/login');
        } catch (err) {
            console.log(err);
            setMessage('Can not register with those credentials - user already exists');
            setToastOpen(true);
        }
    }

    const inputStyle = {
        marginTop: '1em'
    }

    const btnStyle = {
        margin: '8px 0',
        backgroundColor: 'orange',
        color: 'black'
    };

    const paperStyle = {
        padding: 20,
        margin: 'auto',
    };

    return (
        <Container>
            <Stack direction={'column'} justifyContent="center" alignItems="center" height={'100vh'}>
                <Container maxWidth='sm'>
                    <form method="post" onSubmit={handleSubmit}>
                        <Paper elevation={10} style={paperStyle}>
                            <Grid align="center">
                                <LogoTitle text="Register on Meal Overcooked" />
                            </Grid>
                            <Stack>
                                <TextField variant="outlined" label="Login" type="text" name="login" value={inputs.login || ''} onChange={handleChange} required style={inputStyle} />
                                <TextField variant="outlined" label="Email" type="email" name="email" value={inputs.email || ''} onChange={handleChange} required style={inputStyle} />
                                <TextField variant="outlined" label="Full Name" type="text" name="fullName" value={inputs.fullName || ''} onChange={handleChange} required style={inputStyle} />
                                <TextField variant="outlined" label="Password" type="password" name="password" value={inputs.password || ''} onChange={handleChange} required style={inputStyle} />
                                <TextField variant="outlined" label="Confirm password" type="password" name="password_confirm" value={inputs.password_confirm || ''} onChange={handleChange} required style={inputStyle} />
                                <Stack direction={'row'} justifyContent="flex-start" alignItems="center">Profile picture: <InputFileUpload accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" name={'profile_picture'} id={'registrationProfilePicture'} onChange={handlePfpChange} />{addedFile ? <DoneIcon /> : null}</Stack>
                                <Button type="submit" color="primary" variant="contained" style={btnStyle} fullWidth>
                                    Register
                                </Button>
                            </Stack>

                        </Paper>
                    </form>
                    <MessageToast open={toastOpen} onClose={handleClose} severity={'error'}><Typography variant="h5">{message}</Typography></MessageToast>
                </Container>
            </Stack>
        </Container>
    );
}
