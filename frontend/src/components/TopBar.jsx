import React, { useEffect } from 'react';
import { AppBar, Button, ButtonBase, CardActionArea, Divider, IconButton, Link, Stack, SvgIcon, Toolbar, Typography } from '@mui/material';
import AuthUserBadge from './AuthUserBadge';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LogoTitle from './LogoTitle';
import { fetchAuthenticatedUser } from '../redux/auth/authSlice';



const TopBar = () => {
    const navigate = useNavigate();
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const authStatus = useSelector(state => state.auth.status);
    const dispatch = useDispatch();
    const isLoaded = useSelector((state) => state.auth.isLoaded);

    useEffect(() => {
        if (!isLoaded && authStatus != 'loading') {
            dispatch(fetchAuthenticatedUser());
        }
        
    }, [isLoaded]);

    return (
        <AppBar position="sticky" sx={{
            backgroundColor: 'orange',
            color: 'black',
            top: '0px',
        }} >
            <Toolbar variant='regular'>
                <Stack margin={'auto'} direction={'row'} alignItems={'center'} >
                    <LogoTitle active />
                </Stack>

                <Stack direction='row' margin={'auto'} justifyContent={'flex-end'} flexWrap={'wrap'} useFlexGap spacing={3} divider={<Divider orientation='vertical' flexItem />}>
                    <Button color="inherit" onClick={() => navigate('/categories')} >
                                Categories
                        </Button>
                    {authUser
                        ?
                        <>
                            <Button color="inherit" onClick={() => navigate('/myPosts')} >
                                My Posts
                            </Button>
                            <Button color="inherit" onClick={() => navigate('/myFavourites')} >
                                My Favourites
                            </Button>

                            <Button color="inherit" onClick={() => navigate('/posts/new')} >
                                Create Post
                            </Button>
                        </>

                        : <></>}

                    <AuthUserBadge />

                </Stack>

            </Toolbar>
        </AppBar>
    );
};

export default TopBar;
