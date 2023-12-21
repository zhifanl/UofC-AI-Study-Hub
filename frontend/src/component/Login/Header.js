import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DayflowSitting from "../../assets/DayflowSitting.svg";

export default function Header({ heading, subHeading }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "row", marginBottom: "-2.5em" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "2em",
        }}
      >
        <Typography variant="h5" component="h5" mt={5} mb={1} fontWeight="500">
          {heading}
        </Typography>

        <Typography
          variant="body1"
          component="body1"
          mt={0}
          mb={0}
          fontWeight="normal"
        >
          {subHeading}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", marginLeft: "-2em", marginRight: "-2em" }}>
        <img
          src={DayflowSitting}
          alt="a college girl is working on her laptop"
        />
      </Box>
    </Box>
  );
}
