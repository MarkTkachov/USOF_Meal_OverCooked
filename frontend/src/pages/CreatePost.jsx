
import { Grid, Paper, Typography, TextField, Button, FormControl, FormLabel, FormGroup, ToggleButtonGroup, ToggleButton, Tooltip, Container, Backdrop } from '@mui/material';
import TopBar from '../components/TopBar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchAuthenticatedUser } from '../redux/auth/authSlice';
import { fetchAllCategories } from '../redux/categories/categoriesSlice';
import CategoryChip from '../components/CategoryChip';
import axios from 'axios';
import { fetchMyPosts } from '../redux/posts/postsSlice';
import MessageToast from '../components/MessageToast';
import MarkdownEditor from '../components/MarkdownEditor';
import { Suspense } from 'react';


const CreatePost = () => {
    const authStatus = useSelector((state) => state.auth.status);
    const isLoaded = useSelector((state) => state.auth.isLoaded);
    const categoriesStatus = useSelector(state => state.categories.status);
    const categories = useSelector(state => state.categories.categories);
    const [inputs, setInputs] = useState({type: 'markdown'});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({ ...inputs, [name]: value }))
    }

    const setContent = (val) => {
        setInputs({...inputs, content: val});
    }

    useEffect(() => {
        if (!isLoaded && authStatus != 'loading') {
            dispatch(fetchAuthenticatedUser());
        }
        else if (categoriesStatus == 'none') {
            dispatch(fetchAllCategories());
        }

    }, [isLoaded]);

    const [toast, setToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const showMessage = (message) => {
        setToastMessage(message);
        setToast(true);
    }

    const closeMessage = () => {
        setToast(false);
    }
    //<MessageToast open={toast} onClose={closeMessage} severity={'error'}>{toastMessage}</MessageToast>

    if (authStatus == 'logged out') {
        navigate('/login')
    }

    const paperStyle = {
        padding: 20,
        margin: '20px auto',
    };

    const btnStyle = {
        margin: '8px 0',
    };

    const [selectedCategories, setSelectedCategories] = useState([]);

    const handleOptionChange = (event, newSelectedOptions) => {
        setSelectedCategories(newSelectedOptions);
    };

    const handleTypeChange = (event, newType) => {
        if (!newType) return;
        setInputs(inputs => ({ ...inputs, type: newType }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        // Example: Data sent with the form
        const formData = {
            categories: selectedCategories,
            ...inputs
        };
        if (!formData.title || formData.title.trim() == '') return showMessage('Title cannot be empty');
        if (!formData.content || formData.content.trim() == '') return showMessage('Content cannot be empty');

        try {
            let resp = await axios.post('/api/posts/', formData);
            dispatch(fetchMyPosts());
            navigate('/myPosts');
        } catch (error) {
            console.log(error);
            showMessage('Error create Post');
        }
        

        // You can perform additional actions like sending the data to a server here
    };

    return (

        <>
        <Suspense fallback={<Backdrop />}>
        <TopBar />
            <MessageToast open={toast} onClose={closeMessage} severity={'error'}>{toastMessage}</MessageToast>
            <Container maxWidth={'md'}>
                <form onSubmit={handleSubmit}>
                <Typography align="center" variant="h3" marginTop={'10px'} fontFamily={'Kaushan Script'}>Create New Post</Typography>
                    <Paper elevation={10} style={paperStyle} >
                        {/* <Grid align="center">
                            <Typography variant="h5">Create a New Post</Typography>
                        </Grid> */}
                        <TextField label="Title" placeholder="Enter the title" name='title' value={inputs.title || ''} onChange={handleChange} fullWidth required />

                        <Typography>Categories</Typography>
                        <FormControl component="fieldset">
                            <FormGroup>

                                <ToggleButtonGroup
                                    value={selectedCategories}
                                    onChange={handleOptionChange}
                                    aria-label="Select categories"
                                    size='small'
                                    sx={{ display: 'flex', flexWrap: 'wrap' }}
                                >

                                    {categories.map(cat =>
                                        <ToggleButton value={cat.id} color={'success'} key={cat.id}>
                                            <Tooltip title={cat.description}>
                                                <Typography>{cat.title}</Typography>
                                            </Tooltip>
                                        </ToggleButton>)}
                                </ToggleButtonGroup>
                            </FormGroup>
                        </FormControl>
                        <Typography>Format</Typography>
                        <FormControl component="fieldset">
                            <FormGroup>

                                <ToggleButtonGroup
                                    value={inputs.type || 'markdown'}
                                    onChange={handleTypeChange}
                                    aria-label="Select text format"
                                    size='small'
                                    exclusive
                                    sx={{ display: 'flex', flexWrap: 'wrap' }}
                                >
                                    <ToggleButton value={'plain'} color='primary'><Typography>Plain Text</Typography></ToggleButton>
                                    <ToggleButton value={'markdown'} color='secondary'><Typography>Markdown</Typography></ToggleButton>
                                </ToggleButtonGroup>
                            </FormGroup>
                        </FormControl>
                        { inputs.type == 'plain' ?<TextField
                            label="Content"
                            placeholder="Write your post content here"
                            multiline
                            rows={10}
                            fullWidth
                            required 
                            name='content' value={inputs.content || ''} onChange={handleChange}/>
                        : inputs.type == 'markdown' ?  <MarkdownEditor value={inputs.content || ''} onChange={setContent} />
                        : null}
                        
                       
                        <Button type="submit" color="success" variant="contained" style={btnStyle} fullWidth>
                            Create Post
                        </Button>
                    </Paper>
                </form>
            </Container>
        </Suspense>
            
        </>
    );
};

export default CreatePost;
