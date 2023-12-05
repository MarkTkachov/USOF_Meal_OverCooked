import { useEffect, useState } from "react";
import PostPreviewGrid from "../components/PostPreviewGrid";
import axios from "axios";
import TopBar from "../components/TopBar";
import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Pagination, Select, Stack, TextField, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../redux/categories/categoriesSlice";
import PostPreviewList from "../components/PostPreviewList";


export default function AllPosts() {
    const categoriesStatus = useSelector(state => state.categories.status);
    const categories = useSelector(state => state.categories.categories);
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const [posts, setPosts] = useState([]);
    const [maxPages, setMaxPages] = useState(1);
    const [resetPage, setResetPage] = useState(true);
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useState({
        title: '',
        sort: 'rating', // default sorting option
        category: '',
        minDate: '',
        maxDate: '',
        showInactive: false,
        page: 1,
    });
    const [isAdminParamsSet, setIsAdminParamsSet] = useState(false);

    if (authUser?.role == 'Admin' && !isAdminParamsSet) {
        setSearchParams((prevParams) => ({
            ...prevParams,
            showInactive: true,
        }));
        setIsAdminParamsSet(true);
    }

    useEffect(() => {
        if (categoriesStatus == 'none') {
            dispatch(fetchAllCategories());
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    const handlePageChange = (event, value) => {
        setSearchParams(draft => ({
            ...draft,
            page: value
        }));
        //request the server again
        setResetPage(true);
    }

    const handleSearch = async () => {
        let reqOptions = {
            ...searchParams,
            searchByTitle: searchParams.title.trim(),
        }
        if (`${searchParams.category}`.trim() == '') reqOptions.category = null;
        else reqOptions.category = [reqOptions.category];
        if (searchParams.title.trim() == '') reqOptions.searchByTitle = null;
        if (reqOptions.maxDate.trim() == '') reqOptions.maxDate = null;
        if (reqOptions.minDate.trim() == '') reqOptions.minDate = null;

        try {
            let resp = await axios.get('/api/posts/', { params: reqOptions });
            setPosts(resp.data.posts);
            setMaxPages(resp.data.pages)
        } catch (error) {
            console.log(error);
        }
    };

    //search on selecting another page and first showing page
    useEffect(() => {
        if (resetPage) handleSearch();
        setResetPage(false);
    }, [resetPage])

    return (
        <div>
            <TopBar />
            <Container>
                <Typography align="center" variant="h3" marginTop={'10px'} fontFamily={'Kaushan Script'}>Search Posts on Meal OverCooked</Typography>
                <Grid container spacing={2} marginTop={'1em'}>
                    <Grid item xs={12}>
                        <TextField
                            label="Search by Title"
                            fullWidth
                            name="title"
                            value={searchParams.title}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                name="sort"
                                value={searchParams.sort}
                                onChange={handleInputChange}
                            >
                                <MenuItem value="rating">Rating</MenuItem>
                                <MenuItem value="date">Newest first</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select
                                name="category"
                                value={searchParams.category}
                                onChange={handleInputChange}
                            >
                                <MenuItem value={''} selected>Not selected</MenuItem>
                                {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.title}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Min Date"
                            type="date"
                            fullWidth
                            name="minDate"
                            value={searchParams.minDate}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Max Date"
                            type="date"
                            fullWidth
                            name="maxDate"
                            value={searchParams.maxDate}
                            onChange={handleInputChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" color="success" fullWidth onClick={handleSearch}>
                            Search
                        </Button>
                    </Grid>

                </Grid>
                <Stack margin={'0.5em'} direction={'row'} justifyContent={'center'}>
                    <Pagination count={maxPages} page={searchParams.page} showFirstButton showLastButton onChange={handlePageChange} />
                </Stack>
                <PostPreviewList posts={posts} />
            </Container>
        </div>
    );
}
