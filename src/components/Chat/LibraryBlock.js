import { Paper } from "@mui/material";
import React from "react";

const LibraryBlock = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "300px",
        height: "100%",
        overflow: "auto",
      }}
    >
      Библиотека
    </Paper>
  );
};

export default LibraryBlock;
