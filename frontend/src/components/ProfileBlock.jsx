import { Grid, Paper, Avatar, Typography, Stack, Box, Button } from '@mui/material';
import stringAvatar from "../helpers/stringAvatar";
import axios from "axios";
import RatingBadge from "./RatingBadge";
import InputFileUpload from './InputFileUpload';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthenticatedUser } from '../redux/auth/authSlice';
import EditUserDialog from './EditUserDialog';
import { useState } from 'react';


const rootStyle = {
    flexGrow: 1,
    padding: '5px',
}

const paperStyle = {
    padding: '5px',
    display: 'flex',
    alignItems: 'center',
}

const avatarStyle = {
    width: '10em',
    height: '10em',
    marginRight: '5px',
}

const ProfileBlock = ({ user }) => {
    if (!user) return null;
    const { id, fullName, login, email, role, rating, profilePicture } = user;
    const authUser = useSelector((state) => state.auth.authenticatedUser);
    const [editDialog, setEditDialog] = useState(false);

    const handleOpenEditDialog = () => {
        setEditDialog(true);
    }

    const handleCloseEditDialog = () => {
        setEditDialog(false);
    }
    const dispatch = useDispatch();

    const handleChangeAvatar = async () => {
        let formData = new FormData();
        let profile_picture = document.getElementById('new_user_avathar');
            if (profile_picture && profile_picture.files[0]) {
                formData.append("profile_picture", profile_picture.files[0]);
            }
        
        try {
            let resp = await axios.patch('/api/users/avathar', formData, {
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });
            dispatch(fetchAuthenticatedUser());
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div style={rootStyle}>
            <Grid container spacing={3}>
                <Box justifyContent={'center'} alignItems={'center'} margin={'auto'} marginTop={'1em'} >
                    <Grid item xs={12} sm={4} >
                        {profilePicture
                            ? <Avatar sx={avatarStyle} alt={fullName} src={axios.defaults.baseURL + `/api/users/${id}/avathar`} />
                            : <Avatar alt={fullName} sx={{ ...avatarStyle, ...stringAvatar(fullName).sx, }}>{stringAvatar(fullName).children} </Avatar>}

                    </Grid>

                    {authUser?.id == id ?
                        <InputFileUpload text='New Avatar' 
                        sx={{ marginLeft: '1.5em' }} 
                        name={'avathar'} id={'new_user_avathar'} 
                        onChange={handleChangeAvatar} 
                        accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*" />
                        : null}


                </Box>

                <Grid item xs={12} sm={8}>
                    <Paper sx={paperStyle}>
                        <div>
                            <Typography variant="h4"> {fullName}</Typography>
                            <RatingBadge rating={rating} />
                            <Typography variant="subtitle1" color="textSecondary">
                                Email: {email}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Login: {login}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                Role: {role}
                            </Typography>

                            {authUser && authUser.role == 'Admin' ? 
                            <>
                            <Button variant='contained' onClick={handleOpenEditDialog}>Edit User</Button>
                            <EditUserDialog openState={editDialog} closeHandle={handleCloseEditDialog} currentData={user} />
                            </> 
                            : null}
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default ProfileBlock;
