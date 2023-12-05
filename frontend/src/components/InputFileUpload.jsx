import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function InputFileUpload({ name, onChange, id, accept='', sx=null, text='Upload file' }) {
    return (
        <Button sx={sx} component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            {text}
            <VisuallyHiddenInput id={id} type="file" accept={accept} name={name} onChange={onChange}/>
        </Button>
    );
}
