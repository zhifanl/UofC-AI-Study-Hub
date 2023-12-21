import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { BiPowerOff, BiHomeAlt } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function LogOut({ chatType, setCurrentChat, setOpenRemovePopup, handleOpenAddMemberDialog, handleOpenGroupInfoDialog, handleViewMembers }) {

  const navigate = useNavigate();

  const handleClickLogOut = () => {
    localStorage.clear();
    navigate('/');
  }

  const handleClickDashboard = () => {
    window.location.href = '/chat';
  }

  const handleCloseChat = () => {
    setCurrentChat(undefined)
  }
  return (
    <div>
      {chatType === "Group" && (
        <>
          <IconButton onClick={handleViewMembers}>
            <FormatListBulletedIcon />
          </IconButton>
          <IconButton onClick={handleOpenAddMemberDialog}>
            <AddCircleOutlineIcon />
          </IconButton>
          <IconButton onClick={() => { setOpenRemovePopup(true) }}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </>
      )}
      <IconButton onClick={handleCloseChat} color="error">
        <IoMdClose />
      </IconButton>
      <IconButton onClick={handleClickLogOut} color="error">
        <BiPowerOff />
      </IconButton>
      <IconButton onClick={handleClickDashboard} color="primary">
        <BiHomeAlt />
      </IconButton>
    </div>
  )
}
export default LogOut;
