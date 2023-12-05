import { Chip, Tooltip } from "@mui/material";


export default function CategoryChip({ category }) {
    if (!category) return null;
    let {id, title, description } = category;

    return (
        <Tooltip title={description}>
            <Chip variant="filled" label={title} />
        </Tooltip>
    );
}
