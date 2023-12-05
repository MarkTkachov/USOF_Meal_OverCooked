import { Typography } from "@mui/material";


export default function DateSmall({ label, dateStr, align='right' }) {
    

    return (
        <div style={{color: 'gray'}}>
            <Typography noWrap align={align}> {label} {new Date(dateStr).toLocaleString()}</Typography>
        </div>
    );
}
