import React, { useState, useEffect } from "react";
import { Box, Typography } from '@mui/material';
import Robot from "../../assets/giphy.gif";

export default function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function fetchData() {
      const storedUser = localStorage.getItem("study-hub-app-user");
      if (storedUser) {
        setUserName(JSON.parse(storedUser).username);
      }
    }
    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', position: 'absolute', top: '40%', left: '43%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', color: 'white' }}>
      <img src={Robot} alt="Robot" style={{ height: '10rem' }} />
      <Typography variant="h4" color={"black"} gutterBottom>
        Welcome to Study Hub 🎊, <span style={{ color: '#4e0eff' }}>{userName}</span>!
      </Typography>
      <Typography variant="h6" color={"black"}>
        Please select a chat to start messaging.
      </Typography>
    </Box>
  );
}
