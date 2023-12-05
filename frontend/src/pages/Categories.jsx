import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../redux/categories/categoriesSlice";
import { Box, Button, Container, Stack } from "@mui/material";
import TopBar from "../components/TopBar";
import CategoryGrid from "../components/CategoryGrid";
import NewCategoryDialog from "../components/NewCategoryDialog";
import FancyHeading from "../components/FancyHeading";
import RefreshButton from "../components/RefreshButton";


export default function Categories() {
    const categories = useSelector(state => state.categories.categories);
    const status = useSelector(state => state.categories.status);
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const [createDialog, setCreateDialog] = useState(false);
    const dispatch = useDispatch();

    const handleOpenCreateDialog = () => {
        setCreateDialog(true);
    }

    const handleCloseCreateDialog = () => {
        setCreateDialog(false);
    }

    useEffect(() => {
        if (status == 'none' || status == 'error') {
                dispatch(fetchAllCategories());
        }
    }, []);

    return (
        <Box>
            <TopBar />
            <Container>
                <span>
                <FancyHeading>Categories <RefreshButton onClick={() => {dispatch(fetchAllCategories())}} /> </FancyHeading>
                </span>
                
                {authUser && authUser.role == 'Admin' ?
                <>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'center'} marginTop={'0.5em'}>
                        <Button variant="contained" color="success" onClick={handleOpenCreateDialog}>Create Category</Button>
                    </Stack><NewCategoryDialog openState={createDialog} closeHandle={handleCloseCreateDialog} />
                </>
                 : null}
            
                
                
                <CategoryGrid categories={categories} />
            </Container>
        </Box>
    );
    
}
