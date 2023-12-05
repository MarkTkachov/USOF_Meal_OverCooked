import { Typography } from "@mui/material";

export default function FancyHeading(props) {
    return <Typography align="center" variant="h3" marginTop={'10px'} fontFamily={'Kaushan Script'} {...props}>{props.children}</Typography>;
}
