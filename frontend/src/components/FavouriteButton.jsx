import { Box, ButtonBase } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { fetchFavouritePosts } from "../redux/posts/postsSlice";


export default function FavouriteButton({ postId }){
    if(postId == undefined) return null;
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const dispatch = useDispatch();
    const [isFav, setIsFav] = useState(false);
    
    

    useEffect(() => {
        fetchFavState();
    }, [])

    const fetchFavState = async () => {
        try {
            let resp = await axios.get(`/api/posts/${postId}/isFavourite`);
            setIsFav(true);
        } catch (error) {
            setIsFav(false);
        }
    }

    const handleClick = async () => {
        if (isFav) {
            let resp = await axios.delete(`/api/posts/${postId}/favourite`);
            dispatch(fetchFavouritePosts());
            setIsFav(false);
        }
        else {
            let resp = await axios.post(`/api/posts/${postId}/favourite`);
            dispatch(fetchFavouritePosts());
            setIsFav(true);
        }
    }

    if (!authUser) return null;
    
    return (
        <Box>
            <ButtonBase sx={{borderRadius: '50%'}} onClick={handleClick}>
            {isFav 
            ? <FavoriteIcon  sx={{fontSize: 40, color:'red'}} />
            : <FavoriteBorderIcon sx={{fontSize: 40}}  />
            }
            </ButtonBase>
            
        </Box>
    );
    
}
