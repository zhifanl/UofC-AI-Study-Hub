import React, { useState } from 'react';
import { removeMemberRoute, getUserIdByName } from '../../api/Routes';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogTitle, Button, Select, MenuItem, Checkbox, FormControl, InputLabel, OutlinedInput, Box } from '@mui/material';

const RemovePopUpWindow = ({ setGroupMembers, groupMembers, open, onClose, currentUser, currentChat }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);

    const handleSelectChange = (event) => {
        setSelectedMembers(event.target.value);
    };

    const handleRemoveMembers = async () => {

        selectedMembers.forEach(async (member) => {
            try {

                const userIdResponse = await axios.get(getUserIdByName, {
                    params: {
                        username: member
                    },
                });
                let user_id = userIdResponse.data._id
                console.log(user_id)
                const response = await axios.delete(removeMemberRoute, {
                    data: {
                        groupId: currentChat._id,
                        userId: user_id,
                        adminId: currentUser._id
                    }
                });
                setSelectedMembers(prevSelectedMembers =>
                    prevSelectedMembers.filter(memberName => member !== memberName)
                );
                setGroupMembers(prevMembers => prevMembers.filter(member => user_id !== member._id));

                toast.success(`Successfully removed ${member}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } catch (error) {
                toast.error(`Failed to remove ${member}`, {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                console.error("Error removing member:", error);
            }
        });
        onClose();
    }

    // const onTest = () => {
    //     console.log(selectedMembers)
    // }

    return (
        <Dialog open={open} onClose={onClose}>

            <DialogTitle>Remove members from group</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="remove-members-label">Remove Members</InputLabel>
                    <Select
                        labelId="remove-members-label"
                        multiple
                        value={selectedMembers}
                        onChange={handleSelectChange}
                        input={<OutlinedInput label="Remove Members" />}
                        renderValue={(selected) => selected.join(', ')}
                    >
                        {groupMembers.filter(member => member.username !== currentUser.username).map((member, index) => (
                            <MenuItem key={index} value={member.username}>
                                <Checkbox checked={selectedMembers.includes(member.username)} />
                                {member.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleRemoveMembers}>Ok</Button>
                    {/* <Button onClick={onTest}></Button> */}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default RemovePopUpWindow;
