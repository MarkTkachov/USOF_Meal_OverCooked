import { useSelector } from "react-redux";
import { Button, Card, CardActionArea, Stack, Typography } from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from "react-router-dom";
import { Avatar} from "@mui/material";
import stringAvatar from "../helpers/stringAvatar";
import axios from "axios";
import LogoutButton from "./LogoutButton";

export default function AuthUserBadge({ color, logoutBtn=true }) {
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const navigate = useNavigate();
    
    
    const handleClick = () => {
        navigate('/login');
    }

    const handleAuthClick = () => {
        navigate('/me');
    }

    if (!authUser) {
        return (
            <Button variant="contained" endIcon={<LoginIcon />} sx={{borderRadius: '2em'}} onClick={handleClick}>Login</Button>
            );
    }
    else {
        const { fullName, id, profilePicture } = authUser;
        return (
            <>
            <Card color={color} elevation={4} sx={{width: 'fit-content'}}>
                <CardActionArea sx={{width: 'fit-content', padding: '0.5em'}} onClick={handleAuthClick}>
                    <Stack direction='row' spacing={2}>
                        {profilePicture 
                        ? <Avatar alt={fullName} src={axios.defaults.baseURL + `/api/users/${id}/avathar`} /> 
                        : <Avatar alt={fullName} {...stringAvatar(fullName)} />}
                        <Typography variant="h5">{fullName}</Typography>
                    </Stack>
                </CardActionArea>
            </Card>
            {logoutBtn ? <LogoutButton /> :  null}
            
            </>    
        );
    }
    


}
