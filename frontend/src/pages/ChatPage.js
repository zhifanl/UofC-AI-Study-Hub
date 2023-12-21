import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import Contacts from "../component/Chat/Contacts";
import GroupContacts from "../component/Chat/GroupContacts";
import CreateGroupDialog from "../component/Chat/CreateGroupDialog";
import { io } from "socket.io-client";
import {
  allUsersRoute,
  getAllMembers,
  getJoinedGroup,
  host,
} from "../api/Routes";
import ChatContainer from "../component/Chat/ChatContainer";
import Welcome from "../component/Chat/Welcome";
import notify from "../helpers/notifyCreateGroup";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import GroupChatContainer from "../component/Chat/GroupChatContainer";
import AddMemberDialog from "../component/Chat/AddMemberDialog";
import ShowGroupInfo from "../component/Chat/ShowGroupInfo";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import Grid2 from "@mui/material/Unstable_Grid2";

function ChatPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);
  const socket = useRef();
  const location = useLocation();
  const [contacts, setContacts] = useState([]);
  const [groupContacts, setGroupContacts] = useState([]);
  const [currentGroupChat, setCurrentGroupChat] = useState(undefined);

  const [currentChat, setCurrentChat] = useState(undefined);
  const [mode, setMode] = useState("contacts"); // 'contacts' or 'groups'

  const [openDialog, setOpenDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [sharedState, setSharedState] = useState(1);

  const [openAddMemberDialog, setAddMemberDialog] = useState(false);
  const handleOpenAddMemberDialog = () => {
    setAddMemberDialog(true);
  };
  const handleCloseAddMemberDialog = () => setAddMemberDialog(false);

  const [openGroupInfoDialog, setGroupInfoDialog] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const handleOpenGroupInfoDialog = () => {
    async function fetchMemberInfo() {
      if (currentGroupChat) {
        const response = await axios.get(getAllMembers, {
          params: {
            groupId: currentGroupChat._id,
          },
        });
        console.log(response.data.members);
        setGroupMembers(response.data.members);
      }
    }
    fetchMemberInfo();
    console.log("open ", groupMembers);
    setGroupInfoDialog(true);
  };
  const handleCloseGroupInfoDialog = () => setGroupInfoDialog(false);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleNotification = (status) => {
    handleCloseDialog();
    notify(status);
    setGroupName("");
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "contacts" ? "groups" : "contacts"));
  };

  useEffect(() => {
    async function fetchData() {
      let userData = await JSON.parse(
        localStorage.getItem("study-hub-app-user")
      );
      if (!userData) {
        navigate("/");
      } else {
        setCurrentUser(
          await JSON.parse(localStorage.getItem("study-hub-app-user"))
        ); //user info, id, username, email
      }
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          console.log("User data", currentUser);
          console.log("Contact data for all users", data);

          setContacts(data.data);
        } else {
          navigate("/setAvatar");
        }
      }
    }
    fetchData();
  }, [currentUser, navigate]);

  useEffect(() => {
    async function fetchGroupData() {
      if (currentUser) {
        try {
          const data = await axios.get(`${getJoinedGroup}`, {
            params: {
              userId: currentUser._id,
            },
          });

          setGroupContacts(data.data.groups);
        } catch (e) {
          console.log(e.message);
        }
      }
    }

    fetchGroupData();
  }, [currentUser]);

  useEffect(() => {
    if (contacts === undefined || contacts.length === 0) return;
    if (
      location &&
      location.state &&
      location.state.currentSelected !== undefined
    ) {
      setCurrentChat(contacts[location.state.currentSelected]);
      handleChatChange(contacts[location.state.currentSelected]);
    }
  }, [location, contacts]);

  useEffect(() => {
    if (contacts === undefined || contacts.length === 0) return;
    if (
      location &&
      location.state &&
      location.state.currentSelected !== undefined
    ) {
      setCurrentChat(contacts[location.state.currentSelected]);
      handleChatChange(contacts[location.state.currentSelected]);
    }
  }, [location, contacts]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    console.log("current chat changed", chat);
  };

  const handleGroupChatChange = (chat) => {
    setCurrentGroupChat(chat);
    console.log("current group chat changed", chat);
  };

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host, {
        reconnection: true,
        reconnectionDelay: 1000,
      });
      socket.current.emit("add-user", currentUser._id);
      console.log(socket.current);
    }
  }, [currentUser]);

  useEffect(() => {
    // on server disconnection
    if (socket.current) {
      socket.current.on("disconnect", () => {
        console.log("Server disconnected");
        setSharedState(0);
        toast.error("Lost connection from server", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });

      socket.current.on("connect", () => {
        console.log("Connetced to server");
        setSharedState(1);
        toast.success("Successfully connected to server", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
    }

    return () => {
      // Clean up event listeners when the component unmounts
      if (socket.current) {
        socket.current.off("disconnect");
        socket.current.off("reconnect");
      }
    };
  }, [socket.current]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // Function to update window width when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Attach the event listener to the window
    window.addEventListener("resize", handleResize);

    // Cleanup: Remove the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  return (
    <Grid
      container
      columns={{ xs: 1, sm: 1, md: 2 }}
      sx={{
        height: "100vh",
        display: "grid",
        gridTemplateColumns: { md: "30% 70%", lg: "30% 70%" },
      }}
    >
      <Grid item>
        <ToastContainer
          position="top-center"
          autoClose={1800}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Box>
          {mode === "contacts" ? (
            <Contacts
              currentChat={currentChat}
              contacts={contacts}
              currentUser={currentUser}
              changeChat={handleChatChange}
              toggleMode={toggleMode}
              mode={mode}
              sharedState={sharedState}
            />
          ) : (
            <GroupContacts
              currentChat={currentGroupChat}
              contacts={groupContacts}
              currentUser={currentUser}
              changeChat={handleGroupChatChange}
              toggleMode={toggleMode}
              mode={mode}
              sharedState={sharedState}
              handleOpenDialog={handleOpenDialog}
            ></GroupContacts>
          )}
        </Box>
        <CreateGroupDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          handleNotifySuccess={handleNotification}
          groupName={groupName}
          setGroupName={setGroupName}
          contacts={contacts}
          currentUser={currentUser}
        />

        <AddMemberDialog
          open={openAddMemberDialog}
          handleClose={handleCloseAddMemberDialog}
          handleNotifySuccess={handleNotification}
          group={currentGroupChat}
          contacts={contacts}
          currentUser={currentUser}
        />
        <ShowGroupInfo
          open={openGroupInfoDialog}
          handleClose={handleCloseGroupInfoDialog}
          group={currentGroupChat}
          member={groupMembers}
        />
      </Grid>

      <Grid item>
        <Box sx={{ height: "98vh" }}>
          {mode === "contacts" ? (
            currentChat === undefined ? (
              <>
                {windowWidth >= 900 ? (
                  <Welcome currentUser={currentUser} />
                ) : (
                  <></>
                )}
              </>
            ) : (
              <ChatContainer
                currentChat={currentChat}
                setCurrentChat={setCurrentChat}
                currentUser={currentUser}
                socket={socket}
              />
            )
          ) : currentGroupChat === undefined ? (
            <>
              {windowWidth >= 900 ? (
                <Welcome currentUser={currentUser} />
              ) : (
                <></>
              )}
            </>
          ) : (
            <GroupChatContainer
              currentChat={currentGroupChat}
              setCurrentChat={setCurrentGroupChat}
              currentUser={currentUser}
              socket={socket}
              handleOpenAddMemberDialog={handleOpenAddMemberDialog}
              allUserInfo={contacts}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  );
}

export default ChatPage;
