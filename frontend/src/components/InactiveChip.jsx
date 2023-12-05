
import { Chip, Tooltip } from "@mui/material";


export default function InactiveChip({ tooltip='Post is inactive' }) {

    return (
        <Tooltip title={tooltip}>
            <Chip variant="filled" label={'Inactive'} />
        </Tooltip>
    );
}
