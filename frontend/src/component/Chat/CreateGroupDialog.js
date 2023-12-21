import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl, OutlinedInput } from '@mui/material';
import { createGroupRoute, addNewMember } from "../../api/Routes";
import { getGroupIdByName, getUserIdByName } from '../../api/Routes';
import axios from 'axios';

function CreateGroupDialog({ open, handleClose, handleNotifySuccess, groupName, setGroupName, contacts, currentUser }) {

    // State to track selected contacts
    const [selectedContacts, setSelectedContacts] = useState([]);

    // Handle change in select
    const handleSelectChange = (event) => {
        setSelectedContacts(event.target.value);
    };

    const handleCreateGroup = async () => {
        if (groupName && groupName !== '') {
            const data = await axios.post(createGroupRoute, {
                name: groupName,
                userId: currentUser._id
            });

            const response = await axios.get(getGroupIdByName, {
                params: {
                    groupname: groupName
                },
            });

            var group_id = response.data._id

            for (let i = 0; i < selectedContacts.length; i++) {
                const response = await axios.get(getUserIdByName, {
                    params: {
                        username: selectedContacts[i]
                    },
                });
                var user_id = response.data._id

                const data = await axios.post(addNewMember, {
                    groupId: group_id,
                    userId: user_id,
                    adminId: currentUser._id
                });
            }
            handleNotifySuccess("success")
        }else{
            handleNotifySuccess("name-empty-error")
        }
        setSelectedContacts([])
    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Create Group Chat</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Group Name"
                    type="text"
                    fullWidth
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="add-members-label">Add Members</InputLabel>
                    <Select
                        labelId="add-members-label"
                        multiple
                        value={selectedContacts}
                        onChange={handleSelectChange}
                        input={<OutlinedInput label="Add Members" />}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {contacts.map((contact, index) => (
                            <MenuItem key={index} value={contact.username}>
                                <Checkbox checked={selectedContacts.includes(contact.username)} />
                                {contact.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleCreateGroup}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateGroupDialog;
