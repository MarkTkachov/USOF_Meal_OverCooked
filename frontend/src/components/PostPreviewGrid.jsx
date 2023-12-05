import { Grid } from "@mui/material";
import PostPreviewCard from "./PostPreviewCard";
import PostPreviewList from "./PostPreviewList";


export default function PostPreviewGrid({ posts }) {
    if (!posts) return null;
    return (
        <Grid container spacing={2}>
            {posts.map(post => (
                <Grid key={post.id} item>
                    <PostPreviewCard key={post.id} post={post} />   
                </Grid>
            ))}
        </Grid>
    );
}
