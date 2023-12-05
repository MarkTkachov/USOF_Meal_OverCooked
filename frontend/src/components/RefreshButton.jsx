import { IconButton } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';

export default function RefreshButton({ onClick }) {

    return (
        <IconButton onClick={onClick} size="small">
            <RefreshIcon />
        </IconButton>
    );

}
