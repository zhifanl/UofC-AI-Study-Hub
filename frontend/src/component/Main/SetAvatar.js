import { React, useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { setAvatarRoute, fetchAvatarRoute } from "../../api/Routes";

export default function SetAvatar() {
  const navigate = useNavigate();
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if (!localStorage.getItem("study-hub-app-user")) navigate("/");
  }, [navigate]);

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await axios.get(fetchAvatarRoute);
        setAvatars(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching avatars:", error);
      }
    };
    fetchAvatars();
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("study-hub-app-user"));

      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });

      if (data.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("study-hub-app-user", JSON.stringify(user));
        navigate("/chat");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            bgcolor: "#131324",
            height: "100vh",
          }}
        >
          <Box sx={{ color: "white" }}>
            <Typography mt={10} variant="h5">
              Pick an Avatar as your profile picture
            </Typography>
          </Box>
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ marginLeft: "10%", marginRight: "10%" }}
          >
            {avatars.map((avatar, index) => (
              <Grid item key={avatar}>
                <Box
                  sx={{
                    border:
                      selectedAvatar === index
                        ? "0.4rem solid #4e0eff"
                        : "0.4rem solid transparent",
                    borderRadius: "50%",
                    p: 1,
                    cursor: "pointer",
                    "&:hover": { border: "0.4rem solid #4e0eff" },
                    "& img": { height: 96, transition: "0.5s" },
                  }}
                  onClick={() => setSelectedAvatar(index)}
                >
                  <img
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt={`Avatar ${index}`}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={setProfilePicture}
            sx={{ mt: 2 }}
          >
            Set as Profile Picture
          </Button>
          <ToastContainer />
        </Box>
      )}
    </>
  );
}
