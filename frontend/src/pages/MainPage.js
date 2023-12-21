import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';

function MainPage(props) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(undefined);


  useEffect(() => {
    async function fetchData() {
      let userData = await JSON.parse(localStorage.getItem("study-hub-app-user"))
      if (!userData) {
        navigate("/");
      }
      else {
        setCurrentUser(await JSON.parse(localStorage.getItem("study-hub-app-user"))); //user info, id, username, email
      }
    }
    fetchData();
  }, [navigate]);

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          console.log("User data", currentUser)

        } else {
          navigate('/setAvatar');
        }
      }
    }
    fetchData();
    
  }, [currentUser, navigate]);


  return (
    <div>
      <Container maxWidth="xl" sx={{ mt: 5, bgcolor: '#9CA3AF' }}>
      <Box sx={{ height: '75vh', width: '85vw', bgcolor: '#2a2d35', borderRadius: '0.4rem', display: 'grid', gridTemplateColumns: { sm: '35% 65%', md: '30% 70%' } }}>
      </Box>
    </Container>
    </div>
  )
}

export default MainPage