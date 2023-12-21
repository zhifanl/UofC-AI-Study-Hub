import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Checkbox,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput
} from '@mui/material';
import { addNewMember } from "../../api/Routes";
import { getGroupIdByName, getUserIdByName } from '../../api/Routes';
import axios from 'axios';

function AddMemberDialog({ open, handleClose, handleNotifySuccess, group, contacts, currentUser }) {

    // State to track selected contacts
    const [selectedContacts, setSelectedContacts] = useState([]);

    // Handle change in select
    const handleSelectChange = (event) => {
        setSelectedContacts(event.target.value);
    };

    const handleAddMember = async () => {

        if (selectedContacts.length !== 0) {
            try {
                console.log("group contract", contacts)
                const response = await axios.get(getGroupIdByName, {
                    params: {
                        groupname: group.name
                    },
                });
                let group_id = response.data._id


                for (let i = 0; i < selectedContacts.length; i++) {
                    const response = await axios.get(getUserIdByName, {
                        params: {
                            username: selectedContacts[i]
                        },
                    });
                    let user_id = response.data._id

                    const data = await axios.post(addNewMember, {
                        groupId: group_id,
                        userId: user_id,
                        adminId: currentUser._id
                    });
                }
                handleNotifySuccess("add-member-success")
                setSelectedContacts([])
                handleClose()
            } catch (e) {
                handleNotifySuccess("add-member-error")
                console.log(e.messages)
            }
        } else {
            handleClose()
        }

    }

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Invite new member to group</DialogTitle>
            <DialogContent>
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
                <Button onClick={handleAddMember}>Ok</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddMemberDialog;
