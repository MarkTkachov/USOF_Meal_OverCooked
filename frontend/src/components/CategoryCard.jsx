import { Box, Button, Card, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../redux/categories/categoriesSlice";
import { useState } from "react";
import EditCategoryDialog from "./EditCategoryDialog";


export default function CategoryCard({ category }) {
    if (!category) return null;
    const { id, title, description } = category;
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const dispatch = useDispatch();
    const [editDialog, setEditDialog] = useState(false);

    const handleOpenEditDialog = () => {
        setEditDialog(true);
    }

    const handleCloseEditDialog = () => {
        setEditDialog(false);
    }

    const handleDeleteCategory =  async () => {
        if (confirm('Are you sure you want to delete this Category?')) {
            try {
                let resp = await axios.delete(`/api/categories/${id}`);
                dispatch(fetchAllCategories());
            } catch (err) {
                console.log(err);
                alert('Error during deleting category - ' + err.response?.status);
            }
        }
    }
    
    return (
        <Box>
            <Card elevation={3}>
                <Stack direction={'column'} alignItems={'center'} justifyContent={'center'}>
                        <Typography variant="h4" align="center">{title}</Typography>
                    <Typography variant="body2" color={'text.secondary'} align="center">{description}</Typography>
                    {authUser && authUser.role == 'Admin' ? 
                        <>
                        <Button variant="contained" color='error' onClick={handleDeleteCategory}>Delete</Button>
                        <Button variant="contained" onClick={handleOpenEditDialog} >Edit</Button>
                        <EditCategoryDialog openState={editDialog} closeHandle={handleCloseEditDialog} currentData={category} />
                        </>
                    : null}
                </Stack>
            </Card>
        </Box>
    );
}
