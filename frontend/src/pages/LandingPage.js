/* eslint-disable no-multi-str */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Typography, Box, Container, Grid } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import NavBar from "../component/Navigation/NavBar";
import VideoConference from "../assets/VideoConference.png";
import GroupStudy from "../assets/GroupStudy.png";
import GroupDiscussion from "../assets/GroupDiscussion.png";
import BackgroundImage from "../assets/BackgroundImage.png";
import Advertisement from "../component/Landing/Advertisement";

export default function LandingPage() {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  let scale = "none";
  if (isSmall) {
    scale = "scale(0.5)"; // Example scale for small screens
  } else if (isMedium) {
    scale = "scale(0.75)";
  }

  const advertise_text1 =
    "Powered by the latest technology, Studyhub aims to optimize\
                  collaborative learning experience and foster a sense of\
                  community and knowledge sharing among students in an online\
                  environment.";

  const advertise_text2 =
    "Students can collaborate, discuss study topics, ask questions\
                  in either single chats or group chats, and deepen their\
                  understanding of various subjects through chat, group study,\
                  voice calls, and AI bot support.";

  const advertise_text3 =
    "What are you still waiting for? Sign up and start enjoying the\
                  best online learning experience from today!";

  return (
    <>
      <ThemeProvider theme={theme}>
        <NavBar />
        <Box sx={{ width: "100%", paddingTop: "150px" }}>
          <img src={BackgroundImage} style={{ width: "100%" }} />

          <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
            <Advertisement
              text={advertise_text1}
              imagePath={VideoConference}
              order={0}
            />
            <Advertisement
              text={advertise_text2}
              imagePath={GroupStudy}
              order={1}
            />
            <Advertisement
              text={advertise_text3}
              imagePath={GroupDiscussion}
              order={0}
            />
          </Box>
          <Box
            component="footer"
            sx={{
              bgcolor: theme.palette.primary.main,
              color: "white",
              padding: "1em",
            }}
          >
            <Container maxWidth="lg">
              <Typography variant="body1" align="right">
                Contact Us
              </Typography>
              {/* Footer content */}
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}
