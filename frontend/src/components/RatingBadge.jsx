import GradeIcon from '@mui/icons-material/Grade';
import { Stack, Typography } from '@mui/material';

export default function RatingBadge({ rating }) {

    return (
        <Stack direction={'row'} alignItems={'center'}>
            <GradeIcon sx={{color: 'gold'}} fontSize='large'/>
            <Typography fontSize={'large'}>{rating}</Typography>
        </Stack>
    );
}
