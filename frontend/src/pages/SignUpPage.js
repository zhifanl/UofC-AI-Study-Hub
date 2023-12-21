import React from 'react';
import { Container, Box, Typography, Link } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import SignUp from '../component/Login/SignUp';
import signupImage from "../img/signup-img.png";
import Header from '../component/Login/Header';
import { useTheme } from '@emotion/react';

export default function SignUpPage() {
  const theme = useTheme();
  const primaryPalette = useTheme().palette.primary;

  return (
    <Container
      maxWidth="xs"
      sx={{
        marginTop: 10,
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
        heading="Hello, Welcome to StudyHub!"
        subHeading="Sign Up and start enjoying your best learning experience!"
      />

      <SignUp />

      <Typography variant="body1" color={primaryPalette.customBlack} mt={5}>
        Already have an account?{" "}
        <Link
          component={RouterLink}
          to="/signin"
          color={primaryPalette.purple}
          sx={{ "&:hover": { textDecoration: "none" } }}
        >
          Log in
        </Link>
      </Typography>
    </Container>
  );
};