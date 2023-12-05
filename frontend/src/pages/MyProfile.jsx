import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAuthenticatedUser, logout } from "../redux/auth/authSlice";
import TopBar from "../components/TopBar";
import ContentContainer from "../components/ContentContainer";
import ProfileBlock from "../components/ProfileBlock";
import FancyHeading from "../components/FancyHeading";
import RefreshButton from "../components/RefreshButton";


export default function MyProfile() {
    const authUser = useSelector((state) => state.auth.authenticatedUser);
    const authStatus = useSelector((state) => state.auth.status);
    const isLoaded = useSelector((state) => state.auth.isLoaded);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isLoaded && authStatus != 'loading') {
            dispatch(fetchAuthenticatedUser());
        }
        
    }, [isLoaded]);

    if (authStatus == 'logged out') {
        navigate('/login')
    }

    return (
        <div>
            <TopBar />
            <span>
            <FancyHeading> Your Profile Page <RefreshButton onClick={() => {dispatch(fetchAuthenticatedUser())}} /></FancyHeading>
            
            </span>
            
            
            
            <Container>
                <Box marginTop={'10px'}>
                <ProfileBlock user={authUser}/>
                </Box>
                
            </Container>
            
        </div>
    );
    

}
