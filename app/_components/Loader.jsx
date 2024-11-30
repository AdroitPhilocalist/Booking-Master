import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        background: "linear-gradient(135deg, #9B6FCE, #4E92D6)", // Gradient background for the loader
        zIndex: 1000, // Ensures it overlays all content
      }}
    >
      <CircularProgress size={80} thickness={4.5} sx={{ color: "#fff" }} />
    </Box>
  );
};

export default Loader;
