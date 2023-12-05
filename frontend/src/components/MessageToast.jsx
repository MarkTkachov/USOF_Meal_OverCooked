import { Snackbar } from "@mui/material";
import { forwardRef } from "react";
import MuiAlert from '@mui/material/Alert';

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

export default function MessageToast({ open, onClose, autoHideDuration = 6000, severity, children }) {

    if (severity) return (
        <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
            <Alert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
                {children}
            </Alert>
        </Snackbar>
    );
    else return (
        <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={onClose}>
            {children}
        </Snackbar>
    );

}
