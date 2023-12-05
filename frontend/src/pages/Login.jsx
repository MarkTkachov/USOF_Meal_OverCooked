import { useEffect, useState } from "react";
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { Avatar, Button, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthenticatedUser } from "../redux/auth/authSlice";
import LogoTitle from "../components/LogoTitle";
import PasswordResetDialog from "../components/PasswordResetDialog";
import MessageToast from "../components/MessageToast";




export default function Login() {

    const [inputs, setInputs] = useState({});
    const [showReset, setShowReset] = useState(false);
    const [message, setMessage] = useState('');
    let [toastOpen, setToastOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authStatus = useSelector(state => state.auth.status)

    useEffect(() => {
        dispatch(fetchAuthenticatedUser());
    }, [])

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            //console.log(inputs);
            let res = await axios.post('/api/auth/login', inputs, {
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            //console.log(res);

            dispatch(fetchAuthenticatedUser());
            //navigate('/me');

        } catch (err) {
            console.log(err);
            setMessage('Incorrect credentials');
            setToastOpen(true);
        }
    }

    if (authStatus == 'logged in') {
        axios.get('api/users/me').then(() => { navigate('/me'); }).catch(() => { });
    }


    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({ ...inputs, [name]: value }))
    }

    const handleClosePasswordResetRequest = () => {
        setShowReset(false);
    }

    const handleOpenPasswordResetRequest = () => {
        setShowReset(true);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setToastOpen(false);
    };

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

    return (
        
            <Stack direction={'column'} justifyContent="center" alignItems="center" height={'100vh'}>
                <Container maxWidth='sm'>
                    <form method="post" onSubmit={handleSubmit}>
                        <Paper elevation={10} style={paperStyle}>
                            <Grid align="center">
                                <LogoTitle />
                            </Grid>
                            <TextField label="Login" placeholder="Enter login" fullWidth required 
                            style={inputStyle} name="login" value={inputs.login || ''} onChange={handleChange}/>
                            <TextField label="Password" placeholder="Enter password" type="password" 
                            fullWidth required  style={inputStyle} name="password" value={inputs.password || ''} onChange={handleChange} />
                            <Button type="submit" color="primary" variant="contained" style={btnStyle} fullWidth>
                                Sign In
                            </Button>
                            <Stack direction={'row'} justifyContent={'space-around'}>
                                <Button onClick={handleOpenPasswordResetRequest}>Forgot password?</Button>
                                <Button onClick={() => { navigate('/register') }}>No account? Register now</Button>
                            </Stack>
                        </Paper>
                    </form>
                </Container>
                <PasswordResetDialog openState={showReset} closeHandle={handleClosePasswordResetRequest} />
                <MessageToast open={toastOpen} onClose={handleClose} severity={'error'}><Typography variant="h5">{message}</Typography></MessageToast>
            </Stack>
            
            

    );
}
