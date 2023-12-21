/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Logo from "../../assets/Logo.png";

const NavBar = () => {
  const theme = useTheme();

  return (
    <AppBar position="fixed">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <img src={Logo} style={{ transform: "scale(0.75)" }} />
        <Box sx={{ flexGrow: 0 }}>
          <Link component={RouterLink} to="/signin">
            <Typography
              variant="body2"
              sx={{ color: theme.palette.customBlack.white }}
            >
              Sign In
            </Typography>
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
