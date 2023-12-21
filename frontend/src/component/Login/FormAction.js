import React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

// Custom styled MUI Button
const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(3),
    borderRadius: 15,
    padding: 8,
    backgroundColor: theme.palette.primary.purple,
    '&:hover': {
        backgroundColor: theme.palette.error.dark,
    },
    color: theme.palette.common.white,
}));

export default function FormAction({
    handleSubmit,
    action = 'submit',
    text
}) {
    return (
        <div>
            <StyledButton
                type={action}
                onClick={handleSubmit}
                variant="contained"
                fullWidth
            >
                {text}
            </StyledButton>
        </div>
    );
}
