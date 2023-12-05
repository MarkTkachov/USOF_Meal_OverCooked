import { Button, Card, CardActionArea, Stack, Typography, Avatar } from "@mui/material";
import axios from "axios";
import stringAvatar from "../helpers/stringAvatar";
import RatingBadge from "./RatingBadge";


export default function AuthorBadge({ author, elevation=3, children }) {
    if (!author) author = {id: -1, fullName: 'Deleted User', profilePicture: null, rating: 0};

    let { id, fullName, profilePicture, rating} = author;
    if (profilePicture && profilePicture.trim() == '') profilePicture = null;
    return (
        <Card elevation={elevation} sx={{
            width: 'fit-content'
        }}>
            <div style={{width: 'fit-content', padding: '0.5em'}} >
                <Stack direction='row' spacing={2}>
                    {profilePicture 
                    ? <Avatar alt={fullName} src={axios.defaults.baseURL + `/api/users/${id}/avathar`} /> 
                    : <Avatar alt={fullName} {...stringAvatar(fullName)} />}
                    <Typography variant="h6">{fullName}</Typography>
                    {rating ? <RatingBadge rating={rating} />  : null}
                    {children}
                </Stack>
            </div>
        </Card>
    );
}
