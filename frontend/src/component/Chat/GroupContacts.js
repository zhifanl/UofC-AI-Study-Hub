import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Card,
  CardContent,
  TextField,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Grid,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import SensorIcon from "@mui/icons-material/Sensors";
import SensorOffIcon from "@mui/icons-material/SensorsOff";

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function stringAvatar(name) {
  if (!name || name.trim() === "") {
    return {
      sx: {
        bgcolor: "#000000", // Set a default color for empty or undefined name
      },
      children: "",
    };
  }

  const firstNameInitial = name.split(" ")[0]?.[0].toUpperCase() || ""; // Uppercase the first character
  const lastNameInitial = name.split(" ")[1]?.[0].toUpperCase() || ""; // Uppercase the second character

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${firstNameInitial}${lastNameInitial}`,
  };
}

function GroupContacts({
  contacts,
  currentUser,
  changeChat,
  toggleMode,
  mode,
  handleOpenDialog,
  sharedState,
}) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [currentContact, setcurrentContact] = useState(undefined);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
      setCurrentUserImage(currentUser.avatarImage);
    }
  }, [currentUser]);

  useEffect(() => {
    if (contacts === undefined || contacts.length === 0) return;
    setcurrentContact(contacts);
  }, [contacts]);

  const searchInputHandler = (event) => {
    setSearchInput(event.target.value.toLowerCase());
  };

  const filteredContacts = contacts.filter((contact) => {
    return contact.name.toLowerCase().includes(searchInput);
  });

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
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
    <Grid sx={{ height: "100vh" }}>
      <Grid
        ref={topBarRef}
        item
        pb={2}
        sx={{ borderBottom: "2px solid #C6B7B7" }}
      >
        <Box display="flex" mt={1.5}>
          <Typography variant="h5" sx={{ margin: "10px 10px 10px 20px" }}>
            Chat Rooms
          </Typography>
          <IconButton disabled>
            {sharedState === 1 ? <SensorIcon /> : <SensorOffIcon />}
          </IconButton>
          <IconButton onClick={toggleMode}>
            {mode === "contacts" ? <GroupIcon /> : <PersonIcon />}
          </IconButton>
          <IconButton
            color="primary"
            aria-label="add chat room"
            onClick={handleOpenDialog}
          >
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
        <Box display="flex" sx={{ justifyContent: "center" }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Search Room"
            value={searchInput}
            onChange={searchInputHandler}
            InputProps={{
              startAdornment: (
                <IconButton>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px", // Set your desired radius here
              },
              width: "90%",
            }}
          />
        </Box>
      </Grid>

      <Grid
        item
        style={{
          overflowY: "auto",
          height: `calc(100vh - ${componentHeight + 10}px)`,
        }}
      >
        <List
          sx={{
            overflow: "auto",
            pb: 3,
            overflowY: "auto",
          }}
        >
          {filteredContacts.map((contact, index) => (
            <ListItem
              key={contact._id}
              onClick={() => changeCurrentChat(index, contact)}
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
                }}
              >
                <CardContent sx={{ display: "flex", flexDirection: "row" }}>
                  <ListItemAvatar>
                    {contact && contact.name ? (
                      <Avatar {...stringAvatar(contact.name)} />
                    ) : (
                      <></>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact.name}
                    primaryTypographyProps={{
                      fontWeight: "bold",
                    }}
                  />
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      </Grid>

      <Grid ref={bottomBarRef} item>
        <BottomNavigation
          showLabels
          sx={{
            borderTop: "2px solid #C6B7B7",
            bottom: "10px",
            height: 80,
          }}
        >
          <BottomNavigationAction
            label={currentUserName}
            icon={
              <Avatar src={`data:image/svg+xml;base64,${currentUserImage}`} />
            }
          />
          <BottomNavigationAction label="Status" icon={<NotificationsIcon />} />
          <BottomNavigationAction label="" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Grid>
    </Grid>
  );
}
export default GroupContacts;
