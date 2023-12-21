import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput, ListItem, Card, CardContent, ListItemAvatar, ListItemText, List, Avatar
} from '@mui/material';
import {getGroupIdByName, getUserIdByName, getAllMembers} from '../../api/Routes';
import axios from 'axios';

function ShowGroupInfo({open, handleClose, group, member}) {

    // Handle change in select

    const [members, setMembers] = useState([])
    useEffect( () => {
        setMembers(member)
    },[ member])

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Member List</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <List
                        sx={{
                            overflow: "auto",
                            maxHeight: "calc(100% - 220px)",
                            pb: 3,
                            overflowY: "auto",
                            mt: 3,
                            borderTop: "2px solid #C6B7B7",
                        }}
                    >
                        {members.map((members, index) => (
                            <ListItem
                                key={members._id}
                            >
                                <Card
                                    sx={{
                                        width: "100%",
                                        border: "2px solid #C66AE8",
                                        borderRadius: 3,
                                        height: 70,
                                        alignItems: "center",
                                        "&:hover": {
                                            boxShadow: 5,
                                        },
                                    }}>
                                    <CardContent
                                        sx={{display: "flex", flexDirection: "row",}}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={`data:image/svg+xml;base64,${members.avatarImage}`}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={members.username}
                                            primaryTypographyProps={{
                                                fontWeight: "bold",
                                            }}
                                        />
                                    </CardContent>
                                </Card>
                            </ListItem>
                        ))}
                    </List>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button >Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ShowGroupInfo;
