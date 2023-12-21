import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import ChatInput from "./ChatInput";
import axios from "axios";
import LogOut from "./ControlPanel";
import {
  addMessageRoute,
  getAllMessagesRoute,
  openAiRoute,
} from "../../api/Routes";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { v4 as uuidv4 } from "uuid";
import AIPopUpWindow from "./AIPopUpWindow";

export default function ChatContainer({
  currentChat,
  setCurrentChat,
  currentUser,
  socket,
}) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState([]);
  const scrollRef = useRef();
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState("");

  const handleSendMessageToAI = async (prompt) => {
    const res = await axios.post(openAiRoute, { prompt: prompt });
    console.log(res);
    return res;
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setOpenPopup(true);
  };

  useEffect(() => {
    async function fetchData() {
      const response = await axios.post(getAllMessagesRoute, {
        from: currentUser._id,
        to: currentChat._id,
      });
      setMessages(response.data);
    }
    fetchData();
  }, [currentChat, currentUser._id]);

  const handleSendMsg = async ({ type, content, duration, audioUrl }) => {
    if (type === "text") {
      duration = 0;
      const data = await axios.post(addMessageRoute, {
        from: currentUser._id,
        to: currentChat._id,
        message: content,
        to_email: currentChat.email,
        sender: currentUser.username,
        type: type,
      });
    }

    socket.current.emit("send-msg", {
      from: currentUser._id,
      to: currentChat._id,
      message: content,
      type: type,
      audioUrl: audioUrl,
    });

    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: content,
      type: type,
      duration: duration,
      audioUrl: audioUrl,
    });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-receive", (data) => {
        setArrivalMessage({
          fromSelf: false,
          message: data.message,
          type: data.type,
          duration: data.duration,
          audioUrl: data.audioUrl,
        });
      });
    }
  }, [socket]);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const playAudio = (audioUrl) => {
    const audio = new Audio(audioUrl);
    console.log(audioUrl);
    audio.play();
  };

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

  return (
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh", overflow: "hidden" }}
    >
      <Grid item xs={11}>
        <Grid item ref={topBarRef}>
          <Box display="flex">
            <Avatar
              sx={{ paddingRight: "15px" }}
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
            />
            <Typography variant="h6">
              {currentChat.username} ✉️: {currentChat.email}
            </Typography>
          </Box>
          <Box>
            <LogOut chatType="DM" setCurrentChat={setCurrentChat} />
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sx={{
            overflow: "auto",
            p: 1,
            height: `calc(100vh - ${componentHeight + 40}px)`, // Set the height dynamically
            overflowY: "auto",
          }}
        >
          {messages.map((message) =>
            message.type === "text" ? (
              <Box
                key={uuidv4()}
                ref={scrollRef}
                sx={{
                  display: "flex",
                  justifyContent: message.fromSelf ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  onClick={() => handleMessageClick(message.message)}
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
                    message.fromSelf
                        ?<></>
                        : <Avatar
                            sx={{ paddingRight: "15px" }}
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                        />
                  }
                  <Typography sx={{verticalAlign: "middle"}}>{message.message}</Typography>
                  {
                    message.fromSelf
                        ?<Avatar
                            sx={{ paddingLeft: "15px" }}
                            src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                        />
                        : <></>
                  }
                </Paper>
              </Box>
            ) : (
              <Box
                key={uuidv4()}
                ref={scrollRef}
                sx={{
                  display: "flex",
                  justifyContent: message.fromSelf ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  sx={{
                    maxWidth: "40%",
                    p: 1,
                    margin: 1,
                    borderRadius: 2,
                    bgcolor: "white",
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {
                    message.fromSelf
                        ?<></>
                        : <Avatar
                            sx={{ paddingRight: "15px" }}
                            src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                        />
                  }
                  <IconButton
                    onClick={() => playAudio(message.audioUrl)}
                    sx={{ color: "black" }}
                  >
                    <PlayCircleOutlineIcon />
                  </IconButton>
                  <Typography variant="caption">
                    {Math.round(message.duration)} sec
                  </Typography>
                  {
                    message.fromSelf
                        ?<Avatar
                            sx={{ paddingLeft: "15px" }}
                            src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                        />
                        : <></>
                  }
                </Paper>
              </Box>
            )
          )}
          <AIPopUpWindow
            open={openPopup}
            onClose={() => setOpenPopup(false)}
            message={selectedMessage}
            onSend={handleSendMessageToAI}
          />
        </Grid>
        <Grid ref={bottomBarRef} item xs={12}>
          <ChatInput
            chatType="DM"
            handleSendMsg={handleSendMsg}
            currentChat={currentChat}
            currentUser={currentUser}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
