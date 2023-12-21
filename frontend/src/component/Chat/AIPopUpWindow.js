import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, TextField, Button, CircularProgress, Box, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import Robot from "../../assets/rpa.gif";

const AIPopUpWindow = ({ open, onClose, message, onSend }) => {
    const [editedMessage, setEditedMessage] = useState(message);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');

    useEffect(() => {
        setEditedMessage(message);
    }, [message]);

    useEffect(() => {
        if (!open) {
            setResponse(''); // Clear the response when the dialog is closed
            setLoading(false); // Also reset loading state
        }
    }, [open]);

    const handleSend = async () => {
        setLoading(true);
        try {
            const res = await onSend(editedMessage);
            console.log(res)
            setResponse(res.data.response);
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error processing message.');
        }
        setLoading(false);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    width: '100%',
                    height: 'auto',
                    maxWidth: '600px',
                    '@media (max-width: 600px)': {
                        maxWidth: '100%',
                    },
                },
            }}
        >
            <DialogContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', paddingBottom: '3%' }}>
                    <img src={Robot} alt="Robot" style={{ height: '5rem', maxWidth: '100%' }} />
                </Box>
                <TextField
                    multiline
                    fullWidth
                    variant="outlined"
                    value={editedMessage}
                    onChange={(e) => setEditedMessage(e.target.value)}
                />
                <Box display="flex" alignItems="center" mt={2}>
                    <Button onClick={handleSend} startIcon={<ChatIcon />}>
                        Analyze with ChatGPT
                    </Button>
                    {loading && <CircularProgress size={20} sx={{ marginLeft: 2 }} />}
                </Box>
                {!loading && <Typography>{response}</Typography>}
            </DialogContent>
        </Dialog>
    );
};

export default AIPopUpWindow;
