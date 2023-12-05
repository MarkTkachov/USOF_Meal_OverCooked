import { Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


export default function EmailConfirmation() {
    let {token} = useParams();
    let [message, setMessage] = useState('Your account is being activated');
    const navigate = useNavigate();

    useEffect(() => {
        const activateUser = async () => {
            try {
                let res = await axios.post('/api/auth/email-confirmation/' + token);
                setMessage('Success, account is activated. Redirect to login page');
                navigate('/login');
            } catch (err) {
                console.log(err);
                setMessage('Error occured, account can not be activated');
            }
            
        }
        activateUser();
    }, [])

    return (
        <Typography variant="h1">{message}</Typography>
    );


}
