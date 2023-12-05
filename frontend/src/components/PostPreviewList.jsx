import { Container, Grid, Stack } from "@mui/material";
import PostPreviewCard from "./PostPreviewCard";


export default function PostPreviewList({ posts }) {
    if (!posts) return null;
    return (
        <Stack  spacing={3}>
            {posts.map(post => (
                <Container key={post.id}>
                    <Grid key={post.id} item>
                        <PostPreviewCard key={post.id} post={post} />   
                    </Grid>
                </Container>
            ))}
        </Stack>
    );
}
