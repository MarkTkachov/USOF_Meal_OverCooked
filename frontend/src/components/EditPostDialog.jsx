import { Backdrop, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormGroup, MenuItem, Select, Switch, TextField, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import FancyHeading from "./FancyHeading";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../redux/categories/categoriesSlice";
import { fetchAuthenticatedUser } from "../redux/auth/authSlice";
import { fetchPostToDisplay } from "../redux/posts/postsSlice";
import MessageToast from "./MessageToast";
import MarkdownEditor from "./MarkdownEditor";
import { Suspense } from "react";


export default function EditPostDialog({ openState, closeHandle, currentData }) {
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const allCategories = useSelector(state => state.categories.categories);
    const allCategoriesStatus = useSelector(state => state.categories.status);
    const { id, title, content, author, categories, status, type } = currentData;
    const postCategoriesIds = categories.map(cat => cat.id);
    let [inputs, setInputs] = useState(currentData);
    const [selectedCategories, setSelectedCategories] = useState(postCategoriesIds);
    const dispatch = useDispatch();
    const [activeSwitch, setActiveSwitch] = useState(status == 'active')


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




    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(inputs => ({ ...inputs, [name]: value }));
    }

    const setContent = (val) => {
        setInputs({ ...inputs, content: val });
    }

    const handleSwitchChange = (event) => {
        setActiveSwitch(event.target.checked);
        if (event.target.checked) setInputs({ ...inputs, status: 'active' });
        if (!event.target.checked) setInputs({ ...inputs, status: 'inactive' });
    };

    useEffect(() => {
        if (allCategoriesStatus == 'none' || allCategoriesStatus == 'error') {
            dispatch(fetchAllCategories());
        }
    }, []);

    const handleOptionChange = (event, newSelectedOptions) => {
        setSelectedCategories(newSelectedOptions);
        console.log(newSelectedOptions);
    };

    const handleSubmit = async () => {
        try {
            if (!inputs.title || inputs.title.trim() == '') return showMessage('Title cannot be empty');
            if (!inputs.content || inputs.content.trim() == '') return showMessage('Content cannot be empty');
            if (!inputs.status || (inputs.status.trim() != 'active' && inputs.status.trim() != 'inactive')) return showMessage('Invalid status');

            let reqData = { ...inputs, categories: selectedCategories };
            if (authUser.id != author.id) delete reqData.content;
            //console.log(reqData);
            // eslint-disable-next-line no-undef
            let res = await axios.patch(`/api/posts/${id}`, reqData);
            dispatch(fetchPostToDisplay(id));
            closeHandle();
            // setMessage(`Password reset link sent to ${inputs.email}. It will expire in 15 minutes`);

        } catch (err) {
            console.log(err);
            if (err.responce?.status == 404) {
                showMessage('Post not found')
                //closeHandle();
                return;
            }
            showMessage('Error edit post')
            // else setMessage('Error occured during sending email. Please check if email is correct')
            //closeHandle();
        }
    }

    if (!authUser) {
        if (authUser.role != 'Admin' && authUser.id != author.id) return null;
    }

    return (
        <Suspense fallback={<Backdrop />}>
            <Dialog open={openState} onClose={closeHandle}>
                {/* <DialogTitle>Edit Post</DialogTitle> */}
                <DialogContent>
                    <DialogContentText>
                        <FancyHeading variant='h5'>Edit Post</FancyHeading>
                    </DialogContentText>
                    <MessageToast open={toast} onClose={closeMessage} severity={'error'}>{toastMessage}</MessageToast>
                    <TextField
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        name="title"
                        value={inputs.title || ''}
                        onChange={handleChange}
                    />
                    {authUser.id != author.id}
                    {type == 'plain' ? <TextField
                        label="Content"
                        placeholder="Write your post content here"
                        multiline
                        rows={10}
                        fullWidth
                        required
                        disabled={authUser.id != author.id}
                        name='content' value={inputs.content || ''} onChange={handleChange} />
                        : type == 'markdown' ? 
                        authUser.id == author.id ? <MarkdownEditor value={inputs.content || ''} onChange={setContent} /> : null
                        
                            : null}
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

                                {allCategories.map(cat =>
                                    <ToggleButton value={cat.id} selected={selectedCategories.includes(cat.id)} color={'success'} key={cat.id}>
                                        <Tooltip title={cat.description}>
                                            <Typography>{cat.title}</Typography>
                                        </Tooltip>
                                    </ToggleButton>)}
                            </ToggleButtonGroup>
                        </FormGroup>
                    </FormControl>
                    <Typography>Active: <Switch checked={activeSwitch} onChange={handleSwitchChange} /></Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={closeHandle}>Cancel</Button>
                    <Button onClick={handleSubmit}>Edit Post</Button>
                </DialogActions>
            </Dialog>
        </Suspense>

    );


}
