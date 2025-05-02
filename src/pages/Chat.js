import React from "react";
import { Box, Paper, Grid, Typography } from "@mui/material";
import ChatList from "../components/Chat/ChatList";
import ChatWindow from "../components/Chat/ChatWindow";
import ContactInfo from "../components/Chat/ContactInfo";
import SideToolsPanel from "../components/Chat/SideToolsPanel";

export default function Chat() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 180px)",
        bgcolor: "background.default",
        p: 2,
        gap: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "300px",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatList />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          flex: 1,
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ChatWindow />
      </Paper>

      <Paper
        elevation={3}
        sx={{
          width: "300px",
          height: "100%",
          overflow: "auto",
        }}
      >
        <ContactInfo />
      </Paper>
      <Box display="flex" height="100%">
        <SideToolsPanel />
      </Box>
    </Box>
  );
}
