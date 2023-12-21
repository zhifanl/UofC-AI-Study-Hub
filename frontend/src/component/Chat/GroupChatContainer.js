import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import ChatInput from "./ChatInput";
import axios from "axios";
import LogOut from "./ControlPanel";
import {
  fetchGroupChatRecords,
  addGroupMessageRoute,
  listGroupMembersRoute,
  openAiRoute,
} from "../../api/Routes";
import { v4 as uuidv4 } from "uuid";
import AIPopUpWindow from "./AIPopUpWindow";
import RemovePopUpWindow from "./RemovePopUpWindow";
import { stringAvatar } from "../../component/Chat/GroupContacts.js";

export default function GroupChatContainer({
  currentChat,
  setCurrentChat,
  currentUser,
  socket,
  handleOpenAddMemberDialog,
    allUserInfo
}) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState([]);
  const scrollRef = useRef();
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");
  const [openRemovePopup, setOpenRemovePopup] = useState(false);

  const [groupMembers, setGroupMembers] = useState([]);
  const [anchorElGroupMembers, setAnchorElGroupMembers] = useState(null);
  const openListGroupMembers = Boolean(anchorElGroupMembers);

  const handleViewMembers = async (event) => {
    setAnchorElGroupMembers(event.currentTarget);
    try {
      const response = await axios.get(listGroupMembersRoute, {
        params: { groupid: currentChat?._id },
      });
      if (response.data.status === "success") {
        setGroupMembers(response.data.members);
      }
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  const handleCloseViewMembers = () => {
    setAnchorElGroupMembers(null);
  };

  const handleSendMessageToAI = async (prompt) => {
    const res = await axios.post(openAiRoute, { prompt: prompt });
    return res;
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setOpenPopup(true);
  };

  useEffect(() => {
    async function fetchGroupMessages() {
      if (currentChat && currentUser) {
        try {
          const response = await axios.get(fetchGroupChatRecords, {
            params: {
              userId: currentUser._id,
              groupId: currentChat._id,
            },
          });
          if (response.data.status === "success") {
            setMessages(response.data.messages);
          }
        } catch (error) {
          console.error("Error fetching group messages:", error);
        }
      }
    }

    async function fetchExistingGroupMembers() {
      if (currentChat && currentUser) {
        try {
          const response = await axios.get(listGroupMembersRoute, {
            params: { groupid: currentChat?._id },
          });
          if (response.data.status === "success") {
            setGroupMembers(response.data.members);
          }
        } catch (error) {
          console.error("Error fetching group members:", error);
        }
      }
    }

    fetchGroupMessages();
    fetchExistingGroupMembers();
  }, [currentChat, currentUser]);

  const handleSendMsg = async ({ type, content }) => {
    try {
      const response = await axios.post(addGroupMessageRoute, {
        groupId: currentChat._id,
        senderId: currentUser._id,
        content,
      });

      if (response.status === 200) {
        socket.current.emit("send-group-msg", {
          groupId: currentChat._id,
          senderId: currentUser._id,
          content,
        });

        const msgs = [...messages];
        msgs.push({ text: content, sender: currentUser._id });
        setMessages(msgs);
      } else {
        console.error("Failed to send message: ", response.status);
      }
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.emit("join-group", currentChat._id, currentUser._id);

      socket.current.on("group-msg-receive", (messageData) => {
        console.log(messageData);
        if (messageData.groupId === currentChat._id) {
          setMessages((prevMessages) => [...prevMessages, messageData]);
        }
      });
    }

    return () => {
      if (socket.current) {
        socket.current.off("group-msg-receive");
      }
    };
  }, [socket, currentChat, currentUser]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [componentHeight, setComponentHeight] = useState(null);
  const topBarRef = useRef(null);
  const bottomBarRef = useRef(null);

  useEffect(() => {
    const updateComponentHeight = () => {
      if (topBarRef.current) {
        const height =
          topBarRef.current.getBoundingClientRect().height +
          bottomBarRef.current.getBoundingClientRect().height;
        setComponentHeight(height);
      }
    };

    updateComponentHeight();
    window.addEventListener("resize", updateComponentHeight);
    return () => {
      window.removeEventListener("resize", updateComponentHeight);
    };
  }, []);

  function searchAvatar(userId){
    for (let i = 0; i < allUserInfo.length; i++) {
      if (allUserInfo[i]._id === userId){
        return allUserInfo[i].avatarImage
      }
    }
  }



  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh", overflow: "hidden" }}
    >
      <Grid ref={topBarRef} item xs={11}>
        <Box display="flex">
          {currentChat && currentChat.name ? (
            <Avatar {...stringAvatar(currentChat.name)} />
          ) : (
            <></>
          )}
          <Typography sx={{ marginLeft: "15px" }} variant="h6">
            {currentChat.name}
          </Typography>
        </Box>

        <Box display="flex">
          <Menu
            id="group-member-menu"
            anchorEl={anchorElGroupMembers}
            open={openListGroupMembers}
            onClose={handleCloseViewMembers}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {groupMembers.map((member) => (
              <MenuItem
                key={member._id}
                onClick={handleCloseViewMembers}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Avatar
                  src={`data:image/svg+xml;base64,${member.avatarImage}`}
                  alt={member.username}
                  sx={{ width: 24, height: 24, marginRight: 1 }}
                />
                {member.username}
              </MenuItem>
            ))}
          </Menu>
          <LogOut
            chatType="Group"
            setCurrentChat={setCurrentChat}
            setOpenRemovePopup={setOpenRemovePopup}
            handleOpenAddMemberDialog={handleOpenAddMemberDialog}
            handleViewMembers={handleViewMembers}
          />
        </Box>
      </Grid>

      <Grid
        item
        xs={11}
        sx={{
          overflow: "auto",
          p: 1,
          height: `calc(100vh - ${componentHeight + 100}px)`, // Set the height dynamically
          overflowY: "auto",
        }}
      >
        {messages && (
          <>
            {messages &&
              messages.map((message) => {
                const fromSelf = message.sender === currentUser._id;

                return (
                  <Box
                    key={uuidv4()}
                    ref={scrollRef}
                    sx={{
                      display: "flex",
                      justifyContent: fromSelf ? "flex-end" : "flex-start",
                    }}
                  >
                    <Paper
                      onClick={() => handleMessageClick(message.text)}
                      sx={{
                        maxWidth: "40%",
                        p: 1,
                        margin: 1,
                        borderRadius: 2,
                        bgcolor: "white",
                        color: "#black",
                        display:"flex"
                      }}
                    >
                      {
                        fromSelf
                            ?<></>
                            : <Avatar
                                sx={{ paddingRight: "15px" }}
                                src={`data:image/svg+xml;base64,${searchAvatar(message.sender)}`}
                            />
                      }
                      <Typography sx={{verticalAlign: "middle"}}>{message.text}</Typography>
                      {
                        fromSelf
                            ?<Avatar
                                sx={{ paddingLeft: "15px" }}
                                src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                            />
                            : <></>
                      }
                    </Paper>
                  </Box>
                );
              })}
            <AIPopUpWindow
              open={openPopup}
              onClose={() => setOpenPopup(false)}
              message={selectedMessage}
              onSend={handleSendMessageToAI}
            />
            <RemovePopUpWindow
              open={openRemovePopup}
              onClose={() => setOpenRemovePopup(false)}
              currentUser={currentUser}
              currentChat={currentChat}
              groupMembers={groupMembers}
              setGroupMembers={setGroupMembers}
            />
          </>
        )}
      </Grid>
      <Grid ref={bottomBarRef} item xs={11}>
        <ChatInput
          chatType="Group"
          handleSendMsg={handleSendMsg}
          currentChat={currentChat}
          currentUser={currentUser}
        />
      </Grid>
    </Grid>
  );
}
