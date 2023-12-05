import LogoutIcon from '@mui/icons-material/Logout';
import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux"
import { logout } from '../redux/auth/authSlice';
import { clearPostsCache } from '../redux/posts/postsSlice';

export default function LogoutButton() {
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(logout());
        dispatch(clearPostsCache());
    }

    if (authUser != null) {
        return (
            <Button variant="contained" color="error" endIcon={<LogoutIcon />} sx={{borderRadius: '2em'}} onClick={handleClick}>Logout</Button>
        );
    }
    else {
        return (<></>);
    }
}
