import { Box, Card, CardActionArea, CardActions, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AuthorBadge from "./AuthorBadge";
import DateSmall from "./DateSmall";
import RatingBadge from "./RatingBadge";
import InactiveChip from "./InactiveChip";
import { useSelector } from "react-redux";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";


export default function PostPreviewCard({ post, children }) {
    if (!post) return null;
    const { id, title, publishDate, status, content, author, rating, authorId, type } = post;
    const authUser = useSelector(state => state.auth.authenticatedUser);
    const navigate = useNavigate();

    function handleClick() {
        navigate('/posts/' + id);
    }

    if (authUser?.id == authorId) return (
        <Card onClick={handleClick}>
            <CardActionArea >
                <CardContent>
                {status == 'inactive' ? <InactiveChip /> : null}
                    <Typography variant="h4">{title}</Typography>
                    {type == 'plain' ? <Typography maxWidth={'40em'} noWrap>{content}</Typography>
                        : type == 'markdown' ? <Box maxHeight={'10em'} maxWidth={'40em'} overflow={'clip'}>
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} >{content}</Markdown>
                        </Box>
                            : null}



                    <Stack direction={'row'} justifyContent={'space-between'} spacing={4}>
                        <RatingBadge rating={rating} />
                        <DateSmall label={'Published'} dateStr={publishDate} />
                    </Stack>
                    {author ? <AuthorBadge author={author} /> : null}
                </CardContent>
                {children}
            </CardActionArea>
        </Card>
    );

    if (authUser?.id != authorId && status == 'inactive') return (<></>);

    return (
        <Card disabled={status == 'inactive'} onClick={status != 'inactive' ? handleClick : null}>
            <CardActionArea disabled={status == 'inactive'}>
                <CardContent>
                {status == 'inactive' ? <InactiveChip /> : null}
                    <Typography variant="h4" maxWidth={'30em'} noWrap>{title}</Typography>
                    {type == 'plain' ? <Typography maxWidth={'40em'} noWrap>{content}</Typography>
                        : type == 'markdown' ? <Box maxHeight={'10em'} maxWidth={'40em'} overflow={'clip'}>
                            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} >{content}</Markdown>
                        </Box>
                            : null}
                    <Stack direction={'row'} justifyContent={'space-between'} spacing={4}>
                        <RatingBadge rating={rating} />
                        <DateSmall label={'Published'} dateStr={publishDate} />
                    </Stack>
                    {author ? <AuthorBadge author={author} /> : null}
                </CardContent>
                {children}
            </CardActionArea>
        </Card>
    );
}
