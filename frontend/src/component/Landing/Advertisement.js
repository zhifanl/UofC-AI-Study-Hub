/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Advertisement({ text, imagePath, order }) {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const isMedium = useMediaQuery(theme.breakpoints.down("md"));

  let scale = "none";
  if (isMedium) {
    scale = "scale(0.75)"; // Example scale for small screens
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column", // mobile
          sm: "column", // tablets
          md: "row", // small laptop
          lg: "row", // desktop
          xl: "row", // large screens
        },
        alignItems: "center",
        backgroundColor: theme.palette.customBlack.grey,
        padding: {
          xs: "2em 3em", // mobile
          sm: "2em 3em", // tablets
          md: "2em 4em", // small laptop
          lg: "2em 4em", // desktop
          xl: "2em 6em", // large screens
        },
      }}
    >
      {order === 0 && (
        <Box
          sx={{
            marginRight: {
              sm: "0",
              md: "5em",
            },
            width: {},
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              align: {
                md: "center",
                lg: "left",
              },
            }}
          >
            Revolutionize Learning Experience
          </Typography>
          <Typography variant="body1">{text}</Typography>
        </Box>
      )}
      {order === 0 && (
        <Box
          style={{
            transform: scale,
          }}
        >
          <img src={imagePath} />
        </Box>
      )}

      {order === 1 && !isMedium && (
        <Box
          style={{
            transform: scale,
          }}
        >
          <img src={imagePath} />
        </Box>
      )}
      {order === 1 && !isMedium && (
        <Box
          sx={{
            marginRight: {
              sm: "0",
              md: "5em",
            },
            width: {},
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              align: {
                md: "center",
                lg: "left",
              },
            }}
          >
            Revolutionize Learning Experience
          </Typography>
          <Typography variant="body1">{text}</Typography>
        </Box>
      )}

      {order === 1 && isMedium && (
        <Box
          sx={{
            marginRight: {
              sm: "0",
              md: "5em",
            },
            width: {},
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              align: {
                md: "center",
                lg: "left",
              },
            }}
          >
            Revolutionize Learning Experience
          </Typography>
          <Typography variant="body1">{text}</Typography>
        </Box>
      )}
      {order === 1 && isMedium && (
        <Box
          style={{
            transform: scale,
          }}
        >
          <img src={imagePath} />
        </Box>
      )}
    </Box>
  );
}
