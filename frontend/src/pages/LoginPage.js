import React from "react";
import { Link as RouterLink } from "react-router-dom";
import Header from "../component/Login/Header";
import Login from "../component/Login/Login";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

export default function LoginPage() {
  const primaryPalette = useTheme().palette.primary;
  const theme = useTheme();

  return (
    <Container
      maxWidth="xs"
      sx={{
        marginTop: 5,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box>
        <Link component={RouterLink} to="/">
          <Typography
            variant="body2"
            sx={{ color: theme.palette.customBlack.main }}
            align="right"
          >
            Home
          </Typography>
        </Link>
      </Box>

      <Header
        heading="Hello, Welcome Back!"
        subHeading="Happy to see you again! To use your account, please login first."
      />

      <Login />

      <Divider
        sx={{
          "&::before, &::after": {
            borderColor: "primaryPalette.customBlack",
          },
          width: "100%",
          borderColor: theme.palette.customBlack.grey,
          borderWidth: 0.5,
          marginTop: "1rem",
        }}
      />

      <Typography variant="body1" color={primaryPalette.customBlack} mt={2}>
        Don't have an account yet?{" "}
        <Link
          component={RouterLink}
          to="/signup"
          color={primaryPalette.dark}
          sx={{ "&:hover": { textDecoration: "none" } }}
        >
          Sign Up
        </Link>
      </Typography>
    </Container>
  );
}
